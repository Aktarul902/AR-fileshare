const nodemailer = require("nodemailer")
async function sendemail({from,to,subject,text,html}){
   let transport =  nodemailer.createTransport({
       host:"smtp-relay.sendinblue.com",
       port:587,
       secure:false,
       auth:{
           user:"kohalirakesh@gmail.com",
           pass:"gXwr6yC7BD1bHFTG"
       },
   })
   let info =await transport.sendMail({
       from:`ARShare <${from}>`,
       to,
       subject,
       text,
       html
   })
   console.log(info)
}
module.exports = sendemail