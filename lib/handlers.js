/*
 * Request handlers
 */

 // Dependencies
 const _data = require('./data')
 const helpers = require('./helpers')

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
    // Check that all required fields are filled out
    let firstName = 
    typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? 
    data.payload.firstName.trim() : false

    let lastName = 
    typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? 
    data.payload.firstName.trim() : false

    let phone = 
    typeof(data.payload.phone) == 'string' == 10 ? 
    data.payload.phone.trim() : false

    let password = 
    typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? 
    data.payload.password.trim() : false

    let tosAgreement = 
    typeof(data.payload.tosAgreement) == 'boolean' && data.payload.password.tosAgreement == true ? 
    true : false

    firstName && lastName && phone && password && tosAgreement ? 
    '' 
    : callback('Missing required fields')

    if(firstName && lastName && phone && password && tosAgreement ){
        // Make sure the user doesnt already exist
        _data.read('users',phone, (err,data)=> {
            if(err){
                // Hash the password
                const hashedPassword = helpers.hash(password)
            }else{
                // User already exist
                callback(400, {Error: 'A user with that phonenumber already exist'})
            }
        })
    } else {
        callback(400, {Error: "Missing required fields"})
    }
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