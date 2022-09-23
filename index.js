const { request } = require('express')
const express = require('express')
require('./db/config')
const cors = require('cors')
const User = require('./db/user')
const app = express()

app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
  res.send('on home page')
})
app.post('/register', async (req, res) => {
  let user = new User(req.body)
  res.send(req.body)
  let result = await user.save()
  result = result.toObject()
  delete result.password
  res.send(result)
})

app.post('/login', async (req, res) => {
  console.log(req.body)
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select('-password')
    if (user) {
      res.send(user)
    } else {
      res.send({ result: 'No user Found' })
    }
  } else {
    res.send({ result: 'No user Found' })
  }
})

app.listen(5000)
