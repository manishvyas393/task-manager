const express = require("express")
require("../src/db/mongoose")
const app = express()
const userRoutes = require("./routers/user")
const taskRoutes = require("./routers/tasks")
const multer = require("multer")
const upload = multer({
      dest: "images",
      limits: {
            fileSize: 1000000
      }
})
app.post("/upload", upload.single("upload"), (req, res) => {
      res.send()
})
app.use(express.json())
app.use(userRoutes)
app.use(taskRoutes)
module.exports=app
