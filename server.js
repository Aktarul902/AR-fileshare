const express = require("express")
require("dotenv").config()
const path = require("path")
const app = express()
const port = process.env.PORT||5000
const Emitter = require("events")
app.use(express.urlencoded({extended:false}))
app.use(express.json())
const connect = require("./config/db")()
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)
app.use(express.static("./public"))
app.set("views",path.join(__dirname,"./views"))
app.set("view engine","ejs")
const router = require("./routers/router")(app)
const server = app.listen(port,()=>{
    console.log(`listen port from ${port}`)
})
const io = require("socket.io")(server)

io.on('connection', (socket) => {
    // Join
    
  
})
eventEmitter.on("url",(downloadurl)=>{
    console.log(downloadurl)
   io.emit("sendurl",downloadurl)
})
