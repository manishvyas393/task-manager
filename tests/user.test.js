const request = require("supertest")
const app = require("../src/app")
const User = require("../src/models/user")
const {user,userId,setupDb}=require("./fixtures/db")
beforeEach(setupDb)

jest.setTimeout(30000);
test('should create new user', async () => {
      const res = await request(app).post('/users').send({
            name: "manish vyas",
            email: "manishvyas393@gmail.com",
            password: "9769244227"
      }).expect(201)
      const user = await User.findById(res.body.newUser._id)
      expect(user).not.toBeNull()
})
test('should not login', async () => {
      await request(app).post("/users/login").send({
            email: user.email,
            password: "test@123"
      }).expect(400)
})
test('should login user', async () => {
      const res = await request(app).post("/users/login").send({
            email: user.email,
            password: user.password
      }).expect(200)
      const usr = await User.findById(res.body.user._id)
      expect(res.body.token).toBe(usr.tokens[1].token)

})
test("should get logged in user profile", async () => {
      await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send()
            .expect(200)
})
test("should not get user profile", async () => {
      await request(app)
            .get('/users/me')
            .send()
            .expect(401)
})
test("should delete user ", async () => {
      await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send()
            .expect(200)
})
test("should not delete user ", async () => {
      await request(app)
            .delete('/users/me')
            .send()
            .expect(401)
})
test("should upload an avatar", async () => {
      await request(app)
            .post("/users/avatar/me")
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .attach('avatar', "tests/fixtures/637966.jpg")
            .expect(200)
      const usr = await User.findById(userId)
      expect(usr.avatar).toEqual(expect.any(Buffer))
})
test("should update user details", async () => {
      await request(app)
            .patch("/users/me")
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send({
                  name: "tester"
            })
            .expect(200)
      const usr = await User.findById(userId)
      expect(usr.name).toBe("tester")
})
test("should not update user details", async () => {
      await request(app)
            .patch("/users/me")
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send({
                  location: "tester"
            })
            .expect(400)
})