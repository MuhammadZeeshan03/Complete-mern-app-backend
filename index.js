const { request } = require('express')
const express = require('express')
require('./db/config')
const cors = require('cors')
const User = require('./db/user')
const Product = require('./db/Product')
const jwt = require('jsonwebtoken')
const jwtkey = 'my_secret_key'
const app = express()

app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
  res.send('on home page')
})

function verifyToke(req, res, next) {
  let token = req.headers['authorization']
  console.log('Here is ', token)

  if (token) {
    token = token.split(' ')[1]
    console.log('Middleware called', token)
    jwt.verify(token, jwtkey, (err, authData) => {
      if (err) {
        res.send({ result: 'error123' })
      } else {
        next()
      }
    })
  } else {
    res.send({ result: 'Add token with Result' })
  }
}

app.post('/register', async (req, res) => {
  let user = new User(req.body)
  console.log(user)

  let result = await user.save()
  result = result.toObject()
  delete result.password
  console.log(result)

  jwt.sign({ result }, jwtkey, { expiresIn: '1h' }, (err, token) => {
    if (err) {
      res.send({ result: 'error' })
    }
    res.send({ result, auth: token })
  })
})

app.post('/addproduct', async (req, res) => {
  let product = new Product(req.body)
  let result = await product.save()
  res.send(result)
})

app.delete('/product/:id', async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id })
  res.send(result)
})

app.get('/product/:id', async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id })
  if (result) res.send(result)
  else res.send('product not found')
})

app.put('/product/:id', async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body },
  )
  res.send(result)
})

app.get('/search/:key', async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { price: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
    ],
  })
  res.send(result)
  console.log('response sent')
})

app.get('/products', async (req, res) => {
  let products = await Product.find()
  if (products.length > 0) {
    res.send(products)
  } else {
    res.send('no products found')
  }
})

app.post('/login', async (req, res) => {
  console.log(req.body)

  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select('-password')

    if (user) {
      jwt.sign({ user }, jwtkey, { expiresIn: '1h' }, (err, token) => {
        if (err) {
          res.send('error')
        }
        res.send({ user, auth: token })
      })
    } else {
      res.send({ result: 'No user Found' })
    }
  } else {
    res.send({ result: 'No user Found' })
  }
})

app.listen(5000)
