const server = require("express")()
const port = 9001
const dotenv = require("dotenv").config()

const cors = require("cors")

const corsOptions = {
  origin: process.env.REACT_ORIGIN_DOMAIN,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
}

server.use(cors(corsOptions))
server.get("/", (req, res) => res.sendStatus(200))

server.use("/", require("./routes/admin-routes/register"))
server.use("/", require("./routes/admin-routes/authenticate"))
server.use("/", require("./routes/admin-routes/galleries"))
server.use("/", require("./routes/admin-routes/store"))

server.use("/", require("./routes/user-routes/contactform"))
server.use("/", require("./routes/user-routes/galleries"))
server.use("/", require("./routes/user-routes/store"))

server.listen(port, () => console.log(`Server listening on port ${port}!`))
