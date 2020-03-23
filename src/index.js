//import debug module - returns a function that needs an argument for the namespace
const debug = require('debug')('app:startup')
//importing config file
const config = require('config')
//importing middleware to log http requests
const morgan = require('morgan')
//importing middleware to secure app by setting http headers
const helmet = require('helmet')
//input/output validation package
const joi = require('@hapi/joi')
//importing custom middleware functions
const logger = require('../middleware/logger')
//import the course router file
const courses = require('./routes/courses')
//import the homepage router file
const homepage = require('./routes/homepage')
//importing express
const express = require('express')
const app = express()

//importing the template engine to return dynamic html to the client instead of json
app.set('view engine', 'pug') //no need to enquire like other apps, express will load module from here
//setting where the views/templates are stored
app.set('views', './views') //this is the default location - you can create the folder somewhere else if want to

app.use(express.json()) //calling middleware function express.json()
app.use(express.urlencoded({ extended: true} )) //allows you to pass arrays and complex objects using the same format
app.use(express.static('./static')) //point to folder holding your static assets
app.use(helmet())
app.use('/api/courses', courses) //any routes starting /api/courses - use courses router
app.use('/', homepage) //any routes starting /api - use homepage router

//configuration
console.log('App name: ' + config.get('name'));
console.log('Mail server: ' + config.get('mail.host'));

//only log http requests when in development environment
if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    //call the debugger function to log the console messages
    debug("Morgan enabled");
}

app.use(logger)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})