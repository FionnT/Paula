const server = require("express")()
const port = 9001

const cors = require("cors")

server.use(cors())

server.use("/", require("./routes/register"))
server.use("/", require("./routes/authenticate"))
server.use("/", require("./routes/upload"))
server.use("/", require("./routes/requests"))
server.listen(port, () => console.log(`Server listening on port ${port}!`))
