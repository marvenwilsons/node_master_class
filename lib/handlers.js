/*
 * Request handlers
 */

// Dependencies
const _data = require('./data')
const helpers = require('./helpers')

// Define handlers
let handlers = {}

// not found handle
handlers.notFound = (data, callback) => {
    callback(404)
}

// sample handler
handlers.ping = (data, callback) => {
    // Callback a http status code, adn a payload object
    callback(200)
}

handlers.users = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete']

    acceptableMethods.indexOf(data.method) > -1?
        handlers._users[data.method](data, callback) :
        callback(405, {Error: `${data.method} not accepttab`})
}

// Container for the users sub methods
handlers._users = {}

// users - post
handlers._users.post = (data, callback) => {
    // Check that all required fields are filled out
    let firstName =
        typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ?
            data.payload.firstName.trim() : false

    let lastName =
        typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ?
            data.payload.lastName.trim() : false

    let phone =
        typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ?
            data.payload.phone.trim() : false

    let password =
        typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ?
            data.payload.password.trim() : false

    let tosAgreement =
        typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ?
            true : false

    console.log(`${firstName},${lastName},${phone},${password},${tosAgreement}`)

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure the user doesnt already exist
        _data.read('users', phone, (err, data) => {
            if (err) {
                // Hash the password
                const hashedPassword = helpers.hash(password)

                if (hashedPassword) {
                    const userObject = {
                        firstName,
                        lastName,
                        phone,
                        hashedPassword,
                        tosAgreement: true
                    }

                    // Store the user
                    _data.create('users', phone, userObject, (err) => {
                        if (!err) {
                            callback(200)
                        } else {
                            console.log(err)
                            callback(500, { Error: 'Could not create the new user' })
                        }
                    })
                }

            } else {
                // User already exist
                callback(400, { Error: 'A user with that phonenumber already exist' })
            }
        })
    } else {
        callback(400, { Error: `There is an error on the fields submitted`})
    }
}

// users - get
// Required data: phone
// Ontional data: none
// @TODO Only let an authenticated user access their object
handlers._users.get = (data, callback) => {
    // Check that the phone number is valid
    const phone = 
        typeof(data.queryStringObject.phone) == 
        'string' && data.queryStringObject.phone.trim().length == 10 ? 
        data.queryStringObject.phone.trim() : false

    if(phone){
        _data.read('users',phone,(err,data) => {
            if(!err && data){
                // Remove the hashed password from the user object
                // before returning to user
                delete data.hashedPassword
                callback(200,data)
            }else { 
                callback(404,{Error: 'User Not Found'})
            }
        })
    }else {
        callback(400,{Error: 'Missing required field'})
    }
}

// users - put
handlers._users.put = (data, callback) => {

}

// users - delete
handlers._users.delete = (data, callback) => {

}

module.exports = handlers