const nodemailer = require("nodemailer")
const sendWelcomeMail = async (email, name) => {
      const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                  user: process.env.email,
                  pass: process.env.pass
            }
      })
      const options = {
            from: process.env.email,
            to: email,
            subject: "Welcome to our app",
            text: `welcome ${name} to the task-manager`
      }
      transport.sendMail(options, (err) => {
            if (err) {
                  res.status(500).json({
                        err
                  })
            }
      })
}
const sendCancelMail = async (email, name) => {
      const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                  user: "noreplyemail393@gmail.com",
                  pass: "wwzndvqxnwvjgqql"
            }
      })
      const options = {
            from: "noreplyemail393@gmail.com",
            to: email,
            subject: "Account Delete",
            text: `${name} account deleted successfully`
      }
      transport.sendMail(options, (err) => {
            if (err) {
                  res.status(500).json({
                        err
                  })
            }
      })
}
module.exports = { sendWelcomeMail, sendCancelMail }