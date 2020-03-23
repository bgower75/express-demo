//this is a single thread piece of code, so it will run all the lines in order, but the timeout will display last as the function is just scheduling a task

console.log('Before'); //synchronous/blocking
getUser(1)
clg(user)
console.log('After');//synchronous/blocking

function getUser(id) {
    setTimeout(() => { //asynchronous/n0n-blocking - schedules a task for the future
        console.log('reading a user from the database...');
        return {
            id: id, gitHubUsername: 'belinda'
        }
    }, 2000)

}