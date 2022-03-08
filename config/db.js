function mongooseconn (){
   const mongoose = require("mongoose");
   mongoose.connect("mongodb://localhost:27017/signupdata",{
    useNewUrlParser:true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology:false
   }).then(data=>{
        console.log("database connected")
   }).catch(err=>{
      console.log("connect failed")
   })
}
module.exports = mongooseconn