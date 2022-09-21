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
  res.send(result)
})

app.listen(5000)
