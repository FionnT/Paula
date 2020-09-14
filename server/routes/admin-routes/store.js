const { v4: uuidv4 } = require("uuid")
const server = require("express").Router()
const busboy = require("connect-busboy")()
const jsonParser = require("body-parser").json()
const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

const privileged = require("../middleware/privileged")
const authenticated = require("../middleware/authenticated")()
const { StoreItems } = require("../../models/index")

const baseFileDir = "../../../build"
// const baseFileDIr = "../../../public"

server.get("/store/items/all", (req, res) => {
  StoreItems.find({}, (err, results) => {
    if (err) res.sendStatus(502)
    else if (results) res.json(results)
    else res.sendStatus(404)
  })
})

server.post("/store/toggle-publish", jsonParser, (req, res) => {
  let UUID = req.body.UUID
  let isPublished = req.body.isPublished
  StoreItems.findOne({ UUID }, (err, result) => {
    if (err) {
      console.log(err)
      res.sendStatus(502)
    } else if (result) {
      result.isPublished = isPublished
      result.save().then(res.sendStatus(200))
    } else res.sendStatus(404)
  })
})

server.post("/store/update", authenticated, privileged(2), busboy, (req, res) => {
  req.pipe(req.busboy)

  const dirUUID = uuidv4() // Regenerates a new UUID each call, so call once to store one UUID
  const tmpDir = path.join(__dirname, "../../temp", dirUUID)
  const minifiedDir = path.join(tmpDir, "/minified")

  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)
  if (!fs.existsSync(minifiedDir)) fs.mkdirSync(minifiedDir)

  let storeDir = path.join(__dirname, baseFileDir, "/store")
  let itemData
  let itemUUID
  let fileInfo = {}
  let response = { code: undefined }

  req.busboy.on("field", (fieldname, val) => {
    itemData = JSON.parse(val)
    itemUUID = itemData.UUID
    return
  })

  req.busboy.on("file", async (fieldname, file, fileName) => {
    const extension = fileName.split(".").slice(-1)[0]
    const newFileName = uuidv4() + "." + extension
    fileInfo.new = newFileName
    const fstream = fs.createWriteStream(path.join(tmpDir, newFileName))
    file.pipe(fstream)
    return
  })

  const checkItemExists = async () =>
    new Promise(resolve => {
      StoreItems.findOne({ UUID: itemUUID })
        .lean()
        .exec((err, result) => {
          if (err) {
            response.code = 404
            resolve()
          } else {
            fileInfo.old = result.image
            response.code = 200
            resolve()
          }
        })
    })

  const minifyFile = async () => {
    await (async function minify() {
      const fileLocation = path.join(tmpDir, fileInfo.new)
      fileInfo.new = path.join(storeDir, fileInfo.new)
      console.log(fileInfo.new)
      await sharp(fileLocation).resize(null, 300).toFile(fileInfo.new)
      itemData.image = fileInfo.new.split("\\").slice(-1)[0]
      return
    })()

    return
  }

  const cleanupFiles = async () => {
    fs.unlinkSync(path.join(storeDir, fileInfo.old))
    fs.rmdirSync(tmpDir, { recursive: true })
  }

  const storeUpdates = async () => {
    await StoreItems.findOne({ UUID: itemUUID }, (err, result) => {
      if (err) response.code = 500
      else if (result) {
        // Cleanup any changes we made to the image field to make it work client side
        itemData.image = itemData.image.match("/") ? itemData.image.split("/").slice(-1)[0] : itemData.image
        Object.assign(result, itemData)
        result.save().then((response.code = 200))
        return
      } else {
        response.code = 500
        return
      }
    })
    return
  }

  req.busboy.on("finish", async () => {
    await checkItemExists()
    if (response.code === 200) {
      if (fileInfo.new) await minifyFile()
      await storeUpdates()
      if (fileInfo.new && fileInfo.old) await cleanupFiles()
    }
    res.sendStatus(response.code)
  })
})

server.post("/store/new", authenticated, privileged(2), busboy, (req, res) => {
  req.pipe(req.busboy)

  const dirUUID = uuidv4() // Regenerates a new UUID each call, so call once to store one UUID
  const tmpDir = path.join(__dirname, "../../temp", dirUUID)

  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

  let storeDir = path.join(__dirname, "../../../public/store")
  let itemData = {}
  let fileInfo = {}
  let response = { code: undefined }

  req.busboy.on("field", (fieldname, val) => {
    itemData = JSON.parse(val)
    itemData.UUID = uuidv4()
    return
  })

  req.busboy.on("file", async (fieldname, file, fileName) => {
    const extension = fileName.split(".").slice(-1)[0]
    fileInfo.new = uuidv4() + "." + extension // For some reason assigning to a variable instead of JSON breaks things
    const fstream = fs.createWriteStream(path.join(tmpDir, fileInfo.new))
    file.pipe(fstream)
  })

  const minifyFile = async () => {
    await (async function minify() {
      const originalFile = path.join(tmpDir, fileInfo.new)
      const minifiedFile = path.join(storeDir, fileInfo.new)
      await sharp(originalFile).resize(null, 300).toFile(minifiedFile)
      return
    })()
    return
  }

  const cleanupFiles = async () => fs.rmdirSync(tmpDir, { recursive: true })

  const storeItem = async () => {
    itemData.image = fileInfo.new
    const item = new StoreItems(itemData)
    item.save().then((response.code = 200))
    return
  }

  req.busboy.on("finish", async () => {
    await minifyFile()
    await storeItem()
    await cleanupFiles()
    res.sendStatus(response.code)
    res.end()
  })
})

server.post("/store/delete-item", authenticated, privileged(2), jsonParser, async (req, res) => {
  let UUID = req.body.UUID
  StoreItems.findOneAndDelete({ UUID }, (err, result) => {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    } else if (result) {
      const itemImage = path.join(__dirname, baseFileDir, "/store", result.image)
      fs.unlinkSync(itemImage)
      res.sendStatus(200)
    } else res.sendStatus(404)
  })
})

module.exports = server
