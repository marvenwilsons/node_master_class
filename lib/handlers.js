/*
 * Request handlers
 */

 // Dependencies

// Define handlers
let handlers = {}

// not found handle
handlers.notFound = (data,callback) => {
    callback(404)
}

// sample handler
handlers.ping = (data,callback) => {
    // Callback a http status code, adn a payload object
    callback(200)
}

handlers.users = (data,callback) => {
    const acceptableMethods = ['post','get','put','delete']

    acceptableMethods.indexOf(data.method) ? 
    handlers._users[data.method](data,callback) :
    callback(405)
}

// Container for the users sub methods
handlers._users = {}

// users - post
handlers._users.post = (data,callback) => {

}

// users - get
handlers._users.get = (data,callback) => {
    
}

// users - put
handlers._users.put = (data,callback) => {
    
}

// users - delete
handlers._users.delete = (data,callback) => {
    
}

module.exports = handlers