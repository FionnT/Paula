const server = require("express").Router()
const jsonParser = require("body-parser").json()
const busboy = require("connect-busboy")()
const sharp = require("sharp")
const path = require("path")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcrypt")

const privileged = require("../middleware/privileged")
const authenticated = require("../middleware/authenticated")()

const { Photoshoots } = require("../../models/index")
const saltRounds = 10

const mediaDir = process.env.mediaDir
const baseTempDir = path.join(mediaDir, "/temp")
const baseGalleriesDir = path.join(mediaDir, "/galleries")

let acceptableInputData = {
  itemOrder: undefined,
  length: undefined,
  isInHomePosition: undefined,
  isOnHomeScreen: undefined,
  isPublished: undefined,
  title: undefined,
  isPasswordProtected: undefined,
  password: undefined,
  url: String
}

server.post("/galleries/new", authenticated, privileged(2), busboy, (req, res) => {
  req.pipe(req.busboy)

  const dirUUID = uuidv4() // Regenerates a new UUID each call, so call once to store one UUID
  const tmpDir = path.join(baseTempDir, dirUUID)
  const minifiedDir = path.join(tmpDir, "minified")
  const response = { code: undefined }
  let galleryData
  let filteredData = {}
  let galleryFiles = []
  let galleryDir

  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

  req.busboy.on("field", (fieldname, val) => {
    galleryData = JSON.parse(val)
    galleryDir = path.join(baseGalleriesDir, galleryData.url)
  })

  req.busboy.on("file", async (fieldname, file, fileName) => {
    const extension = fileName.split(".").slice(-1)[0]
    const newFileName = uuidv4() + "." + extension

    const fstream = fs.createWriteStream(path.join(tmpDir, newFileName))

    galleryFiles.push(newFileName)
    file.pipe(fstream)
    return
  })

  const checkGalleryIsUnique = () => {
    return Photoshoots.find({ url: galleryData.url }, (err, data) => {
      if (err) response.code = 500
      else if (data.length || fs.existsSync(galleryDir)) response.code = 403
      else {
        fs.mkdirSync(galleryDir)
        response.code = 200
        return
      }
    })
  }

  const minifyFiles = async () => {
    fs.mkdirSync(minifiedDir)

    await (async function minify() {
      for (let item in galleryFiles) {
        const file = galleryFiles[item]
        const fileLocation = path.join(tmpDir, file)
        const minifiedFile = path.join(minifiedDir, file)
        await sharp(fileLocation).resize(null, 800).toFile(minifiedFile)
        continue
      }
      return
    })()

    return
  }

  // If the password field was selected, but no password entered, disable the password
  // Otherwise create a hash, and store it
  const hashPassword = async () => {
    if (!filteredData.isPasswordProtected) return
    else if (!filteredData.password) {
      filteredData.isPasswordProtected = false
      return
    } else {
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, async (err, salt) => {
          if (err) {
            response.code = 500
            reject(err)
          } else {
            bcrypt.hash(filteredData.password, salt, (err, hash) => {
              if (err) {
                response.code = 500
                reject(err)
              } else {
                console.log(hash)
                filteredData.password = hash
                resolve()
              }
            })
          }
        })
      })
    }
  }

  const saveGallery = async () => {
    Object.keys(acceptableInputData).forEach(acceptableField => {
      filteredData[acceptableField] = galleryData[acceptableField]
    })

    filteredData.itemOrder = galleryFiles
    filteredData.length = galleryFiles.length

    // Make sure we hashed the password
    if (filteredData.password && filteredData.password === galleryData.password) response.code = 500
    const gallery = new Photoshoots(filteredData)
    await gallery
      .save()
      .then(
        galleryFiles.forEach(file => {
          fs.renameSync(path.join(minifiedDir, file), path.join(galleryDir, file))
        })
      )
      .then((response.code = 200))
      .catch(err => console.log(err))
    return
  }

  const deleteTmpFiles = async () =>
    fs.rmdirSync(tmpDir, {
      recursive: true // Will not work below Node ~= v14
    })

  const cleanUpAfterError = () =>
    new Promise(async (resolve, reject) => {
      if (fs.existsSync(tmpDir)) await deleteTmpFiles()
      if (fs.existsSync(galleryDir)) fs.rmdirSync(galleryDir, { recursive: true })
      await Photoshoots.findOneAndDelete({ url: galleryData.url }) // We create a fake ID on client side, which does not reflect real ID
        .then(resolve())
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })

  req.busboy.on("finish", async () => {
    try {
      await checkGalleryIsUnique()
      if (response.code !== 200) await deleteTmpFiles()
      else {
        await minifyFiles()
        await hashPassword()
        await saveGallery()
        await deleteTmpFiles()
      }
      if (response.code === 500) await cleanUpAfterError() // Delete our work if we created it, but could not complete it - 500 is only used for issues completing work
      res.sendStatus(response.code)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  })
})

server.post("/galleries/update", authenticated, privileged(2), busboy, (req, res) => {
  req.pipe(req.busboy)

  const dirUUID = uuidv4() // Regenerates a new UUID each call, so call once to store one UUID
  const tmpDir = path.join(baseTempDir, dirUUID)
  const minifiedDir = path.join(tmpDir, "minified")
  const response = { code: undefined }
  let galleryData
  let filteredData = {}
  let galleryFiles = []
  let newFiles = []
  let galleryDir

  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

  req.busboy.on("field", (fieldname, val) => {
    galleryData = JSON.parse(val)
    galleryFiles = galleryData.itemOrder
    galleryDir = path.join(baseGalleriesDir, galleryData.url)
    return
  })

  req.busboy.on("file", async (fieldname, file, fileName) => {
    const extension = fileName.split(".").slice(-1)[0]
    const newFileName = uuidv4() + "." + extension
    const fstream = fs.createWriteStream(path.join(tmpDir, newFileName))
    newFiles.push({ old: fileName, new: newFileName })
    file.pipe(fstream)
    return
  })

  const checkGalleryExists = async () =>
    new Promise(resolve => {
      Photoshoots.findById(galleryData._id)
        .lean()
        .exec(err => {
          if (err) {
            response.code = 404
            resolve()
          } else {
            response.code = 200
            resolve()
          }
        })
    })

  const deleteTmpFiles = async () =>
    fs.rmdirSync(tmpDir, {
      recursive: true // Will not work below Node ~= v14
    })

  const minifyFiles = async () => {
    fs.mkdirSync(minifiedDir)

    await (async function minify() {
      for (let item in newFiles) {
        const file = newFiles[item].new
        const fileLocation = path.join(tmpDir, file)
        const minifiedFile = path.join(minifiedDir, file)
        await sharp(fileLocation).resize(null, 800).toFile(minifiedFile)
        continue
      }
      return
    })()

    return
  }

  const hashPassword = async () => {
    if (!galleryData.isPasswordProtected) return
    else if (!galleryData.password) {
      galleryData.isPasswordProtected = false
      return
    } else {
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, async (err, salt) => {
          if (err) {
            response.code = 500
            reject(err)
          } else {
            bcrypt.hash(galleryData.password, salt, (err, hash) => {
              if (err) {
                response.code = 500
                reject(err)
              } else {
                galleryData.password = hash
                resolve()
              }
            })
          }
        })
      })
    }
  }

  const implementChanges = async () => {
    let galleryFilesClone = galleryFiles.slice()

    if (!fs.existsSync(galleryDir)) fs.mkdirSync(galleryDir)

    // Replace the old filenames with the new ones, and maintain positioning
    newFiles.forEach(file => {
      galleryFiles.forEach((item, index) => {
        if (typeof item === "object") {
          if (file.old === item.path) {
            galleryFilesClone.splice(index, 1, file.new)
          }
        }
      })
    })

    try {
      newFiles.forEach(file => {
        fs.renameSync(path.join(minifiedDir, file.new), path.join(galleryDir, file.new))
      })
    } catch (err) {
      console.log(err)
      response.code = 500
      return
    }

    Object.keys(acceptableInputData).forEach(key => {
      filteredData[key] = galleryData[key]
    })

    filteredData.itemOrder = galleryFilesClone
    filteredData.length = galleryData.itemOrder.length
    return
  }

  const saveGalleryChanges = async () =>
    new Promise(resolve => {
      Photoshoots.findByIdAndUpdate(galleryData._id, filteredData, err => {
        if (err) {
          response.code = 500
          resolve()
        } else {
          response.code = 200
          resolve()
        }
      })
    })

  req.busboy.on("finish", async () => {
    try {
      await checkGalleryExists()
      if (response.code !== 200) await deleteTmpFiles()
      else {
        await minifyFiles()
        await hashPassword()
        await implementChanges()
        await saveGalleryChanges()
        await deleteTmpFiles()
      }
      if (response.code === 500) await deleteTmpFiles() // Delete our work if we created it, but could not complete it, 500 is only used for issues completing work
      res.sendStatus(response.code)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  })
})

server.post("/galleries/update-positions", authenticated, privileged(2), jsonParser, async (req, res) => {
  Photoshoots.find({}, (err, data) => {
    if (err) res.sendStatus(500)
    else {
      const existingPhotoshoots = data
      const newPhotoshoots = req.body
      existingPhotoshoots.forEach(Photoshoot => {
        newPhotoshoots.forEach(newPhotoshoot => {
          // Sometimes React/We send null in the array \__0__/
          if (newPhotoshoot) {
            let existingID = Photoshoot._id.toString()
            let submittedID = newPhotoshoot._id.toString()
            if (existingID === submittedID && Photoshoot.isInHomePosition !== newPhotoshoot.isInHomePosition) {
              Photoshoot.isInHomePosition = newPhotoshoot.isInHomePosition
              Photoshoot.save()
            }
          }
        })
      })
      res.sendStatus(200)
    }
  })
})

server.post("/galleries/delete", authenticated, privileged(2), jsonParser, async (req, res) => {
  const response = { code: undefined }
  const { _id } = req.body

  Photoshoots.findOneAndDelete({ _id }, (err, photoshoot) => {
    if (err) {
      console.log(err)
      response.code = 500
    } else if (photoshoot) {
      const galleryDir = path.join(baseGalleriesDir, photoshoot.url)
      if (fs.existsSync(galleryDir)) fs.rmdirSync(galleryDir, { recursive: true })
      response.code = 200
    } else response.code = 404
    res.sendStatus(response.code)
  })
})

server.get("/photoshoots/all", authenticated, privileged(2), (req, res) => {
  Photoshoots.find({})
    .sort("isInHomePosition")
    .lean()
    .exec((err, results) => {
      if (err) res.sendStatus(502)
      else {
        let responseBody = {
          homeGalleries: [],
          privateGalleries: [],
          unpublishedGalleries: []
        }
        results.forEach(photoshoot => {
          if (photoshoot.isOnHomeScreen) responseBody.homeGalleries.push(photoshoot)
          else if (photoshoot.isPublished) responseBody.privateGalleries.push(photoshoot)
          else responseBody.unpublishedGalleries.push(photoshoot)
        })
        res.json(responseBody)
      }
    })
})

module.exports = server
