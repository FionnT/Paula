const { v4: uuidv4 } = require("uuid")
const server = require("express").Router()
const busboy = require("connect-busboy")()
const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

const privileged = require("../middleware/privileged")
const authenticated = require("../middleware/authenticated")()
const { StoreItems } = require("../../models/index")

server.post("/store/update", authenticated, privileged(2), busboy, (req, res) => {
  req.pipe(req.busboy)

  const dirUUID = uuidv4() // Regenerates a new UUID each call, so call once to store one UUID
  const tmpDir = path.join(__dirname, "../../temp", dirUUID)
  const minifiedDir = path.join(tmpDir, "/minified")

  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)
  if (!fs.existsSync(minifiedDir)) fs.mkdirSync(minifiedDir)

  let storeDir = path.join(__dirname, "../../../public/store")
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
      fileInfo.new = path.join(minifiedDir, fileInfo.new)
      await sharp(fileLocation).resize(null, 300).toFile(fileInfo.new)
      return
    })()

    return
  }

  const implementChanges = async () =>
    new Promise((resolve, reject) => {
      const fileName = fileInfo.new.split("\\").slice(-1)[0]
      fs.renameSync(fileInfo.new, path.join(storeDir, fileName))
      itemData.image = fileName
      resolve()
    })

  const cleanupFiles = async () => {
    fs.unlinkSync(path.join(storeDir, fileInfo.old))
    fs.rmdirSync(tmpDir, { recursive: true })
  }

  const storeUpdates = async () => {
    await StoreItems.findOne({ UUID: itemUUID }, (err, result) => {
      if (err) response.code = 500
      else if (result) {
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
      await implementChanges()
      await storeUpdates()
      if (fileInfo.old) await cleanupFiles()
      res.sendStatus(response.code)
    } else res.sendStatus(response.code)
  })
})

module.exports = server
