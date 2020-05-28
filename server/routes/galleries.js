const server = require("express").Router()
const jsonParser = require("body-parser").json()
const busboy = require("connect-busboy")()
const sharp = require("sharp")
const path = require("path")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")
const privileged = require("./middleware/privileged")
const authenticated = require("./middleware/authenticated")()
const { Photoshoots } = require("../models/index")

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

// authenticated, privileged(2),
server.post("/galleries/new", authenticated, privileged(2), busboy, (req, res) => {
  req.pipe(req.busboy)

  const dirUUID = uuidv4() // Regenerates a new UUID each call, so call once to store one UUID
  const tmpDir = path.join(__dirname, "../temp/", dirUUID, "/")
  const saveDir = path.join(__dirname, "../../public/galleries/")
  const response = { code: 200 }
  let galleryData
  let galleryFiles = []
  let galleryDir

  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

  const checkGalleryIsUnique = () => {
    return Photoshoots.find({ url: galleryData.url }, (err, data) => {
      if (err) response.code = 500
      else if (data.length || fs.existsSync(galleryDir)) response.code = 403
      else response.code = 200
    })
  }

  const deleteTmpFiles = async () =>
    fs.rmdirSync(tmpDir, {
      recursive: true // Will not work below Node ~= v14
    })

  const minifyFiles = async () => {
    return new Promise((resolve, reject) => {
      const minifiedDir = path.join(tmpDir, "minified")
      fs.mkdir(minifiedDir, async () => {
        for (let i = 0; i < galleryFiles.length - 1; i++) {
          const file = galleryFiles[i]
          const fileLocation = path.join(tmpDir, file)
          const minifiedFile = path.join(minifiedDir, file)
          await sharp(fileLocation).resize(null, 800).toFile(minifiedFile)
          if (i === galleryFiles.length - 1) resolve()
        }
      })
    })
  }

  const saveGallery = async () => {
    let filteredData = {}

    Object.keys(acceptableInputData).forEach(acceptableField => {
      filteredData[acceptableField] = galleryData[acceptableField]
    })

    filteredData.itemOrder = galleryFiles
    filteredData.length = galleryFiles.length

    const gallery = new Photoshoots(filteredData)
    await gallery
      .save()
      .then(
        galleryFiles.forEach(file => {
          fs.renameSync(path.join(tmpDir, "/minified/", file), path.join(galleryDir, file))
        })
      )
      .then((response.code = 200))
      .catch(err => console.log(err))
  }

  req.busboy.on("field", (fieldname, val) => {
    galleryData = JSON.parse(val)
    galleryDir = path.join(saveDir, galleryData.url)
  })

  req.busboy.on("file", async (fieldname, file, fileName) => {
    const fileUUID = uuidv4()
    const extension = fileName.split(".").slice(-1)[0]
    const newFileName = fileUUID + "." + extension

    const fstream = fs.createWriteStream(path.join(tmpDir, newFileName))

    galleryFiles.push(newFileName)
    file.pipe(fstream)
  })

  req.busboy.on("finish", async () => {
    try {
      await checkGalleryIsUnique()
      if (response.code !== 200) await deleteTmpFiles()
      else {
        fs.mkdirSync(galleryDir)
        await minifyFiles()
        await saveGallery()
        await deleteTmpFiles()
      }
      res.sendStatus(response.code)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  })
})

server.post("/galleries/update-positions", jsonParser, async (req, res) => {
  Photoshoots.find({}, (err, data) => {
    if (err) {
      res.sendStatus(500)
    } else {
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

module.exports = server
