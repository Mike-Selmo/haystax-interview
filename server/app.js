const express = require('express')
const bodyParser = require('body-parser')
const userService  = require('./services/userService')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false}))

app.post('/api/register', function (req, res) {
  let userServiceObj = new userService(req, res)
  userServiceObj.register()
})

app.listen(4200, function () {
  console.log('Service listening on port 3000')
})