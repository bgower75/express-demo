const express = require('express')
const router = express.Router()

router.get('/', (req,res) => { //(req, res) => {} is a middleware function
    // res.send('Hello World') //this returns json data to the client
    //using pug template to return html to the client:
    res.render('index', { title: 'My Express App', message: 'Hello'}) //setting the properties of the html template to return
})

module.exports = router