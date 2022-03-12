function router(app){
    const multer = require("multer")
    const path = require("path")
 const File = require("../config/models/fileschema")
 const flash = require("express-flash")
 const session = require("express-session")
 const MongoDbStore = require("connect-mongo")(session)
 const fs = require("fs");
    const {v4:uuid4} = require("uuid")
    let storage = multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,"uploads/")
        },
        filename:(req,file,cb)=>{
            const uniquiename = `${Date.now()}-${Math.round(Math.random()*1E9)}-${path.extname(file.originalname)}`
            cb(null,uniquiename)
        }
    })
    let upload = multer({
        storage:storage,
        limit:{fileSize:1000000 * 100}
    }).single("myfile")
  

app.get("/",(req,res)=>{
 
    res.render("index")
    
})


app.post("/files", (req,res)=>{
    upload(req, res, async (err) => {
        console.log(req.file)
        console.log(upload)
        if(!req.file){
            console.log(req.file)
            console.log("error")
        }
        if (err) {
          return res.status(500).send({ error: err.message });
        }
          const file = new File({
              filename: req.file.filename,
              uuid: uuid4(),
              pathname: req.file.path,
              size: req.file.size,
          }); 
          const response = await file.save();
          const downlaodurl = `${process.env.APP_BASE_URL}/files/${response.uuid}`
      

          console.log(req.headers.host)
        
       return res.render("link",{
           url:downlaodurl,
           uuid:response.uuid
       }) 
})
})

app.get("/files/:uuid",async(req,res)=>{
    const file = await File.findOne({uuid:req.params.uuid})
    if(!file){
        res.render("download",{error:"Something Went Wrong"})
        res.status(404)
    }
    res.render("download",{
        uuid:file.uuid,
        filename:file.filename,
        size:file.size,
        downloadLink:`${process.env.APP_BASE_URL}/files/download/${file.uuid}`
    })
})
app.get("/files/download/:uuid",async(req,res)=>{
      const file = await File.findOne({uuid:req.params.uuid})
      if(!file){
          res.render("download",{error:"your link is expires"})
      }
      let filepath = `${__dirname}/../${file.pathname}`
      res.download(filepath)
      fs.unlink(`../uploads/${file.filename}`,(err)=>{
          if(!err){
              console.log("file deleted")

          }
    })
    const delfile = await File.findByIdAndDelete({_id:file._id})
})
app.post("/api/files/send",async(req,res)=>{
    const {uuid,emailfrom,emailto}= req.body
    console.log(req.body.uuid)
    if(!uuid || !emailfrom || !emailto){
        res.render("link")

    }
    const file = await File.findOne({uuid:uuid})
    console.log(file)

    file.sender = emailfrom
    file.receiver = emailto
    const response = await file.save()
    // send mail
    const sendemail = require("../services/emailsend")({
        from : emailfrom,
        to:emailto,
        subject:"ARShare File Sharing",
        text:`${emailfrom} share a file with you `,
        html:require("../services/emailteplates")({
            emailFrom:emailfrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file/1000)+"KB",
            expires:"24 hours"
        })
    })
    return res.redirect("/")
})
}
module.exports = router