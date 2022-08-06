const router = require("express").Router()
const User = require("../models/user")
const auth = require("../middlewares/auth")
const multer = require("multer")
const sharp = require("sharp")
const { sendWelcomeMail, sendCancelMail } = require("../utils/sendEmail")
const upload = multer({
      limits: {
            fileSize: 1000000
      },
      fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
                  return cb(new Error("please upload an image"))
            }
            cb(undefined, true)
      }
})
router.post("/users", async (req, res) => {
      const newUser = new User(req.body)
      try {
            await newUser.save()
            await sendWelcomeMail(newUser.email, newUser.name)
            const token = await newUser.generateAuthToken()
            res.status(201).send({
                  newUser,
                  token
            })
      } catch (error) {
            res.status(400).send(error)
      }
})
router.post("/users/login", async (req, res) => {
      const { email, password } = req.body
      try {
            const user = await User.findByCredentials(email, password)
            const token = await user.generateAuthToken()
            res.send({
                  user,
                  token
            })
      } catch (error) {
            res.status(400).json(error)
      }
})
router.post("/users/logout", auth, async (req, res) => {
      try {
            req.user.tokens = req.user.tokens.filter((token) => {
                  return token.token != req.token
            })
            await req.user.save()
            res.send()
      } catch (error) {
            res.status(500).send(error)
      }
})
router.post("/users/logoutAll", auth, async (req, res) => {
      try {
            req.user.tokens = []
            await req.user.save()
            res.send()
      } catch (error) {
            res.status(500).send(error)
      }
})
router.get("/users/me", auth, async (req, res) => {
      res.status(200).json(req.user)
})
router.patch("/users/me", auth, async (req, res) => {
      const updates = Object.keys(req.body)
      const allowedUpdates = ["name", "email", "password", "age"]
      const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
      if (!isValidOperation) {
            return res.status(400).send("invalid update")
      }
      try {
            updates.forEach((update => req.user[update] = req.body[update]))
            await req.user.save()
            res.send(req.user)
      } catch (error) {
            res.status(500).send(error)
      }
})
router.delete("/users/me", auth, async (req, res) => {
      try {
            req.user.remove()
            await sendCancelMail(req.user.email, req.user.name)
            res.send(req.user)
      } catch (error) {
            res.status(500).send(error)
      }
})
router.post("/users/avatar/me", auth, upload.single("avatar"), async (req, res) => {
      const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
      req.user.avatar = buffer
      await req.user.save()
      res.send()
}, (error, req, res, next) => {
      res.status(400).send({ error: error.message })
})
router.delete("/users/me/avatar", auth, async (req, res) => {
      req.user.avatar = undefined
      await req.user.save()
      res.send()
})
router.get("/users/:id/avatar", async (req, res) => {
      try {
            const user = await User.findById({ _id: req.params.id })
            if (!user) {
                  return res.status(404).send("user not found")
            }
            res.set('Content-Type', "image/jpg")
            res.send(user.avatar)
      } catch (error) {
            res.status(500).send(error)
      }

})

module.exports = router