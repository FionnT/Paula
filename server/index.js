const server = require("express")()
const port = 9001
const dotenv = require("dotenv").config()

const cors = require("cors")
const path = require("path")

const corsOptions = {
  origin: process.env.REACT_ORIGIN_DOMAIN,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
}

server.use(cors(corsOptions))
server.get("/", (req, res) => res.sendStatus(200))
server.use("/", require("./routes/register"))
server.use("/", require("./routes/authenticate"))
server.use("/", require("./routes/galleries"))
server.use("/", require("./routes/requests"))
server.use("/", require("./routes/contactform"))
server.use("/", require("./routes/store"))
server.listen(port, () => console.log(`Server listening on port ${port}!`))
