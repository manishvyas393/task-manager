const router = require("express").Router()
const Tasks = require("../models/tasks")
const auth = require("../middlewares/auth")

router.post("/tasks", auth, async (req, res) => {
      const newTask = new Tasks({
            ...req.body,
            owner: req.user._id
      })
      try {
            await newTask.save()
            res.status(201).send(newTask)
      } catch (error) {
            res.status(400).send(error)
      }
})
router.get("/tasks", auth, async (req, res) => {
      const match = {}
      const sort={}
      const { completed,limit,skip,sortBy } = req.query
      if (completed) {
            match.completed = completed === "true"
      }
      if (sortBy) {
            const parts = sortBy.split(":");
            sort[parts[0]]=parts[1]==="desc"?-1:1
      }
      try {
            //const tasks = await Tasks.find({owner:req.user._id})
            await req.user.populate({
                  path: "tasks",
                  match,
                  options: {
                        limit: parseInt(limit),
                        skip: parseInt(skip),
                        sort
                  }
            })
            res.status(200).json(req.user.tasks)
      } catch (error) {
            console.log(error)
            res.status(400).send(error)
      }
})
router.get("/tasks/:id", auth, async (req, res) => {
      const { id } = req.params
      try {
            const task = await Tasks.findOne({ _id: id, owner: req.user._id })
            if (!task) {
                  return res.status(404).send()
            }
            res.status(200).send(task)
      } catch (error) {
            res.status(500).send(error)
      }
})

router.patch("/tasks/:id", auth, async (req, res) => {
      const id = req.params.id;
      const updates = Object.keys(req.body)
      const allowedUpdates = ["description", "completed"]
      const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
      if (!isValidOperation) {
            return res.status(400).send("invalid update")
      }
      try {
            const task = await Tasks.findOneAndUpdate({ _id: id, owner: req.user._id }, req.body, { new: true, runValidators: true })
            if (!task) {
                  return res.status(404).send()
            }
            res.send(task)
      } catch (error) {
            res.status(500).send(error)
      }
})
router.delete("/tasks/:id", auth, async (req, res) => {
      const id = req.params.id
      try {
            const task = await Tasks.findOneAndDelete({ _id: id, owner: req.user._id })
            if (!task) {
                  return res.status(404).send()
            }
            res.send(task)
      } catch (error) {
            res.status(500).send(error)
      }
})
module.exports = router