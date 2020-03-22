//calling use of environment variables
require('dotenv').config()
//importing config file
const config = require('config')
//importing custom middleware functions
const logger = require('./logger')
const authenticater = require('./authentication')
//importing express
const express = require('express')
const app = express()
//input/output validation package
const joi = require('@hapi/joi')
//importing middleware to secure app by setting http headers
const helmet = require('helmet')
//importing middleware to log http requests
const morgan = require('morgan')

//configuration
console.log('App name: ' + config.get('name'));
console.log('Mail server: ' + config.get('mail.host'));
const port = process.env.PORT || 3000
console.log(port);
//******WHY WILL IT NOT READ FROM THE ENV FILE???? ********************************/
//import debug module - returns a function that needs an argument for the namespace
const debug = require('debug')('app:startup')
console.log(debug);
//******************************************************************************** */
const nodeEnv = process.env.NODE_ENV
if (process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = 'development'
}
//getting the environment variable using process.env.NODE_ENV variable
console.log(`NODE_ENV: ${ nodeEnv }`);
//getting the environemnt variable using the app.get('env') - this reads whats in process.env.NODE_ENV
console.log(`app: ${(app.get('env'))}`);
//importing the template engine to return dynamic html to the client instead of json
app.set('view engine', 'pug') //no need to enquire like other apps, express will load module from here
//setting where the views/templates are stored
app.set('views', './views') //this is the default location - you can create the folder somewhere else if want to

app.use(express.json()) //calling middleware function express.json()
app.use(express.urlencoded({ extended: true} )) //allows you to pass arrays and complex objects using the same format
app.use(express.static('./static')) //point to folder holding your static assets
app.use(logger); //calling a custom middleware function
app.use(authenticater);
app.use(helmet())
//only log http requests when in development environment
// if (app.get('env') === 'development') {
//     app.use(morgan('tiny'))
//     //call the debugger function to log the console messages
//     debug("Morgan enabled");
//     return
// }

//set the course objects
const courses = [
    {courseId: 1, courseName: 'JavaScript'},
    {courseId: 2, courseName: 'Java'},
    {courseId: 3, courseName: 'React'},
    {courseId: 4, courseName: 'CSS'},
    {courseId: 5, courseName: 'HTML'}
]

app.get('/', (req,res) => { //(req, res) => {} is a middleware function
    // res.send('Hello World') //this returns json data to the client
    //using pug template to return html to the client:
    res.render('index', { title: 'My Express App', message: 'Hello'}) //setting the properties of the html template to return
})

app.get('/api/courses', (req,res) => {
    res.send(courses)
})

//looking for a specific id from the courses array
app.get('/api/courses/:courseId', (req, res) => {
    //find the course with the id matching the param passed, and transform to an integer (parseInt)
    const returnedCourse = courses.find(course =>  course.courseId === parseInt(req.params.courseId))
    //if the course id does not exist return a status of 404 of not found
    if (!returnedCourse) {
        res.status(404).send('Course not found')
        //if course id found return the course object
    }
    res.send(returnedCourse)
})
//setting a route to return a single course object using the courseName parameter ':courseName' is the name of the parameter
//route parameters
app.get('/api/courses/:courseName', (req, res) => {
    const returnedCourse = courses.find(course =>  course.courseName === parseInt(req.params.courseName))
    if (!returnedCourse) {
        res.status(404).send('Course not found')
        //to read the route parameter you use the params method from express
    }
    res.send(req.params.courseName)
})

//query parameters
app.get('/api/courses/:courseId', (req, res) => {
    const returnedCourse = courses.find(course =>  course.courseId === parseInt(req.query.courseId))
    if (!returnedCourse) {
        res.status(404).send('Course not found')
        //to read the query parameter use the query method from express
    }
    res.sendStatus(req.query.courseId)
})

app.post('/api/courses', (req, res) => {
    //validate the course body
    const {error} = validateCourse(req.body)

    //if invalid return a bad request (400)
    if(error) {
       return res.status(400).send("name is required") //return statement terminates the req, res cycle
    }

    const course = {
        //when working with a dataset and not a database, must manually assign the id, so get the length of the dataset and increment by 1
        courseId: courses.length + 1,
        //read the name of the course from the body of the request (in the url)
        courseName: req.body.courseName
    }
    courses.push(course)
    res.send(course)
})

//doing an update to a specific course
app.put('/api/courses/:courseId', (req, res) => {
    //look up the course
    const course = courses.find( c => c.courseId === parseInt(req.params.courseId))
    //if not existing, return a 404 (resource not found)
    if(!course) {
       return res.status(404).send('Course not found')
    }
   
    //validate the course body
    const {error} = validateCourse(req.body)

    //if invalid return a bad request (400)
    if(error) {
       return res.status(400).send(error) 
    }

    //update the course
    course.courseName = req.body.courseName
    //return the updated course to the client
    res.send(course)
})

app.delete('/api/courses/:courseId', (req, res) => {
    const course = courses.find(c => c.courseId === parseInt(req.params.courseId))
    if (!course) {
        return res.status(404).send('course not found')
    }
    
    //find the index of the course in the courses array
    const index = courses.indexOf(course)
    courses.splice(index, 1)
    res.send(`course ${course.courseId} deleted`)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

function validateCourse(course) {
     //validate the request
     //set the schema
     const schema = joi.object().keys({
        courseId: joi.number().integer(),
        courseName: joi.string().required()
    })
    //return the result
   return schema.validate(course)
}