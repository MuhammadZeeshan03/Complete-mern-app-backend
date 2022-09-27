const { request } = require('express')
const express = require('express')
require('./db/config')
const cors = require('cors')
const User = require('./db/user')
const Product = require('./db/Product')

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
      res.send(user)
    } else {
      res.send({ result: 'No user Found' })
    }
  } else {
    res.send({ result: 'No user Found' })
  }
})

app.listen(5000)
