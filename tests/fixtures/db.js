const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("../../src/models/user")
const Tasks = require("../../src/models/tasks")
const userId = new mongoose.Types.ObjectId()
const user = {
      _id: userId,
      name: "manish",
      email: "manishvyas@gmail.com",
      password: "9769244227",
      tokens: [{
            token: jwt.sign({ id: userId.toString() }, process.env.Token_secret)
      }]
}
const userId2 = new mongoose.Types.ObjectId()
const user2 = {
      _id: userId2,
      name: "test",
      email: "tester@gmail.com",
      password: "9769244227",
      tokens: [{
            token: jwt.sign({ id: userId2.toString() }, process.env.Token_secret)
      }]
}
const taskOne = {
      _id: new mongoose.Types.ObjectId(),
      description: 'first task',
      completed: false,
      owner: user._id
}
const taskTwo = {
      _id: new mongoose.Types.ObjectId(),
      description: 'second task',
      completed: true,
      owner: user._id
}
const taskThree = {
      _id: new mongoose.Types.ObjectId(),
      description: 'third task',
      completed: true,
      owner: user2._id
}
const setupDb = async () => {
      await User.deleteMany({})
      await Tasks.deleteMany({})
      await new User(user).save()
      await new User(user2).save()
      await new Tasks(taskOne).save()
      await new Tasks(taskTwo).save()
      await new Tasks(taskThree).save()
}
module.exports = {
      userId,
      user,
      userId2,
      user2,
      setupDb,
      taskOne,
      taskTwo,
      taskThree
}