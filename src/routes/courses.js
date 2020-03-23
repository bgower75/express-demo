const express = require('express')
const router = express.Router()

//set the course objects
const courses = [
    {courseId: 1, courseName: 'JavaScript'},
    {courseId: 2, courseName: 'Java'},
    {courseId: 3, courseName: 'React'},
    {courseId: 4, courseName: 'CSS'},
    {courseId: 5, courseName: 'HTML'}
]

router.get('/', (req,res) => {
    res.send(courses)
})

//looking for a specific id from the courses array
router.get('/:courseId', (req, res) => {
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
router.get('/:courseName', (req, res) => {
    const returnedCourse = courses.find(course =>  course.courseName === parseInt(req.params.courseName))
    if (!returnedCourse) {
        res.status(404).send('Course not found')
        //to read the route parameter you use the params method from express
    }
    res.send(req.params.courseName)
})

//query parameters
router.get('/:courseId', (req, res) => {
    const returnedCourse = courses.find(course =>  course.courseId === parseInt(req.query.courseId))
    if (!returnedCourse) {
        res.status(404).send('Course not found')
        //to read the query parameter use the query method from express
    }
    res.sendStatus(req.query.courseId)
})

router.post('/', (req, res) => {
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
router.put('/:courseId', (req, res) => {
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

router.delete('/:courseId', (req, res) => {
    const course = courses.find(c => c.courseId === parseInt(req.params.courseId))
    if (!course) {
        return res.status(404).send('course not found')
    }
    
    //find the index of the course in the courses array
    const index = courses.indexOf(course)
    courses.splice(index, 1)
    res.send(`course ${course.courseId} deleted`)
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

module.exports = router