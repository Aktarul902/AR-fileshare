const express = require("express")
require("dotenv").config()
const path = require("path")
const app = express()
const port = process.env.PORT||5000
app.use(express.static("./public"))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
const connect = require("./config/db")()
app.set("views",path.join(__dirname,"./views"))
app.set("view engine","ejs")
const router = require("./routers/router")(app)
const server = app.listen(port,()=>{
    console.log(`listen port from ${port}`)
})


