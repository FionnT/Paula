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

const order = {
  status: "Order Received",
  message: "Thank you for your purchase! We've received your order, and your payment will be processed shortly. You can view your order details below.",
  paymentSucceeded: false,
  purchaseCost: 297,
  items: [
    { image: "http://placekitten.com/200/138", name: "Dath Beis", amount: "1", cost: "99" },
    { image: "http://placekitten.com/200/287", name: "Dath Beis", amount: "1", cost: "99" }
  ],
  shipping: true
}

server.set("view engine", "pug")
server.set("views", path.join(__dirname, "/emails"))
server.get("/email-preview", (req, res) => res.render("email.pug", { order }))

server.use(cors(corsOptions))
server.get("/", (req, res) => res.sendStatus(200))
server.use("/", require("./routes/register"))
server.use("/", require("./routes/authenticate"))
server.use("/", require("./routes/galleries"))
server.use("/", require("./routes/requests"))
server.use("/", require("./routes/contactform"))
server.use("/", require("./routes/store"))
server.listen(port, () => console.log(`Server listening on port ${port}!`))
