const server = require("express")()
const port = 9001
const dotenv = require("dotenv").config()

// Express Cookie handler
const cookieParser = require("cookie-parser")
server.use(cookieParser())

// Rate Limiter, DDOS protection
const RateLimit = require("express-rate-limit")
const limiter = new RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60
})
server.use(limiter)

// CORS implementation
const cors = require("cors")
const corsOptions = {
  origin: process.env.REACT_ORIGIN_DOMAIN,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
}
server.use(cors(corsOptions))

// Express Session & MongoDB storage of
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
const maxSessionLength = 1000 * 60 * 60 * 4 // 4 hours
const store = new MongoDBStore(
  {
    uri: "mongodb://localhost:27017/paula",
    collection: "sessions"
  },
  err => {
    if (err) console.log(err)
  }
)
server.use(
  session({
    secret: process.env.LOGIN_SECRET,
    cookie: {
      maxAge: maxSessionLength,
      httpOnly: false,
      secure: false,
      sameSite: "lax"
    },
    store: store,
    resave: false,
    saveUninitialized: true
  })
)

server.use(express.bodyParser({ limit: "250mb" }))

// Express CORS sessions

server.use("/", require("./routes/admin-routes/authenticate"))
server.use("/", require("./routes/admin-routes/store"))
server.use("/", require("./routes/admin-routes/galleries"))
server.use("/", require("./routes/admin-routes/users"))
server.use("/", require("./routes/admin-routes/orders"))

server.use("/", require("./routes/user-routes/contactform"))
server.use("/", require("./routes/user-routes/galleries"))
server.use("/", require("./routes/user-routes/store"))

server.get("/", (req, res) => res.sendStatus(200))

server.listen(port, () => console.log(`Server listening on port ${port}!`))
