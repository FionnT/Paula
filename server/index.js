const server = require("express")()
const port = 9001
const dotenv = require("dotenv").config()
const cors = require("cors")

var corsOptions = {
  origin: process.env.REACT_REQUEST_DOMAIN,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
}

server.use(cors(corsOptions))
server.get("/", (req, res) => res.sendStatus(200))
server.use("/", require("./routes/register"))
server.use("/", require("./routes/authenticate"))
server.use("/", require("./routes/upload"))
server.use("/", require("./routes/logout"))
server.use("/", require("./routes/requests"))
server.use("/", require("./routes/contactform"))
server.listen(port, () => console.log(`Server listening on port ${port}!`))
