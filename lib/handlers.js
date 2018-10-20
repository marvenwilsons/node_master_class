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

    // Add _users prop to handlers obj
    acceptableMethods.indexOf(data.method) > -1 ?
        handlers._users[data.method](data, callback) :
        callback(405, { Error: `${data.method} not accepttab` })
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
        callback(400, { Error: `There is an error on the fields submitted` })
    }
}

// users - get
// Required data: phone
// Ontional data: none
handlers._users.get = (data, callback) => {
    // Check that the phone number is valid
    const phone =
        typeof (data.queryStringObject.phone) ==
            'string' && data.queryStringObject.phone.trim().length == 10 ?
            data.queryStringObject.phone.trim() : false

    if (phone) {
        // get the token from the headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false
        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {
                _data.read('users', phone, (err, data) => {
                    if (!err && data) {
                        // Remove the hashed password from the user object
                        // before returning to user
                        delete data.hashedPassword
                        callback(200, data)
                    } else {
                        callback(404, { Error: 'User Not Found' })
                    }
                })
            } else {
                callback(403, { Error: 'Missing required token in header or invalid' })
            }
        })
    } else {
        callback(400, { Error: 'Missing required field' })
    }
}

// users - put
// Required data: phone
// Optional data: firstname lastname, password, (at least one must be specified)
// @TODO Only let an authenticated user update their own object not anyone else
handlers._users.put = (data, callback) => {
    // Check for the required field
    const phone =
        typeof (data.payload.phone) ==
            'string' && data.payload.phone.trim().length == 10 ?
            data.payload.phone.trim() : false

    // Check for the optional fields
    let firstName =
        typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ?
            data.payload.firstName.trim() : false

    let lastName =
        typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ?
            data.payload.lastName.trim() : false

    let password =
        typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ?
            data.payload.password.trim() : false

    // Error if the phone is invalid
    if (phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {
            //Lookup user
            _data.read('users', phone, (err, userData) => {
                if (!err && userData) {
                    // Update the fields necessary
                    if (firstName) { userData.firstName = firstName }
                    if (lastName) { userData.lastName = lastName }
                    if (password) { userData.hashedPassword = helpers.hash(password) }

                    // Store data
                    _data.update('users', phone, userData, (err) => {
                        if (!err) {
                            callback(200)
                        } else {
                            console.log(err)
                            callback(500, { Error: 'Could nit update the user' })
                        }
                    })
                } else {
                    callback(400, { Error: 'The specified user does not exist' })
                }
            })
        } else {
            callback(400, { Error: 'MIssing fields to update' })
        }
    } else {
        callback(400, { Error: 'Missing required field' })
    }

}

// users - delete
// Required data: phone
// @TODO Cleanup (delete) any other data files associated this user
handlers._users.delete = (data, callback) => {
    // Check that the phone number is valid
    const phone =
        typeof (data.queryStringObject.phone) ==
            'string' && data.queryStringObject.phone.trim().length == 10 ?
            data.queryStringObject.phone.trim() : false

    if (phone) {
        _data.read('users', phone, (err, data) => {
            if (!err && data) {
                // Remove the hashed password from the user object
                // before returning to user
                _data.delete('users', phone, (err) => {
                    if (!err) {
                        callback(200)
                    } else {
                        callback(500, { Error: 'Could not delete the specified user' })
                    }
                })
            } else {
                callback(404, { Error: 'Could not find the specified user' })
            }
        })
    } else {
        callback(400, { Error: 'Missing required field' })
    }

}

// TOKENS
handlers.tokens = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete']

    acceptableMethods.indexOf(data.method) > -1 ?
        handlers._tokens[data.method](data, callback) :
        callback(405, { Error: `${data.method} not accepttable` })
}

// Container for all tokens methods
handlers._tokens = {}

// Tokens - post
// Required data: phone, password
handlers._tokens.post = (data, callback) => {
    let phone =
        typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ?
            data.payload.phone.trim() : false

    let password =
        typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ?
            data.payload.password.trim() : false

    if (phone && password) {
        // Lookup the user who matched that phone number
        _data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                // Hash the send password
                let hashedPassword = helpers.hash(password)
                if (hashedPassword == userData.hashedPassword) {
                    // if valid create new token with random name. Set epiration date 1 hour in
                    let tokenId = helpers.createRandomString(40)
                    let expires = Date.now() + 1000 * 60 * 60
                    let tokenObject = {
                        phone,
                        tokenId,
                        expires
                    }
                    _data.create('tokens', tokenId, tokenObject, (err) => {
                        if (!err) {
                            callback(200, tokenObject)
                        } else {
                            callback(500, { Error: 'Could not create the new token' })
                        }
                    })
                } else {
                    callback(400, { Error: 'Password did not match the specified users stored password' })
                }
            } else {
                callback(400, { 'Error': 'Could not find the specified user' })
            }
        })
    } else {
        callback(400, { Error: 'Missing required fields' })
    }
}

// Tokens - get
handlers._tokens.get = (data, callback) => {
    const id =
        typeof (data.queryStringObject.id) ==
            'string' && data.queryStringObject.id.trim().length == 40 ?
            data.queryStringObject.id.trim() : false

    if (id) {
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                callback(200, tokenData)
            } else {
                callback(404, { Error: 'User Not Found' })
            }
        })
    } else {
        callback(400, { Error: 'Missing required field' })
    }
}

// Tokens - put
// Required dataL id, extend
// Optional data: none
handlers._tokens.put = (data, callback) => {
    id =
        typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 40 ?
            data.payload.id.trim() : false

    extend =
        typeof (data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false

    if (id && extend) {
        // lookup the token
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                if (tokenData.expires > Date.now()) {
                    // Set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60
                    _data.update('tokens', id, tokenData, (err) => {
                        if (!err) {
                            callback(200)
                        } else {
                            callback(500, { Error: 'Could not update the token' })
                        }
                    })
                } else {
                    callback(400, { Error: 'The token already expired' })
                }
            } else {
                callback(400, { Error: 'SPecified token does note exist' })
            }
        })
    } else {
        callback(400, { Error: 'Missing required field(s) or invalid' })
    }

}

// Tokens - delete
handlers._tokens.delete = (data, callback) => {
    const id =
        typeof (data.queryStringObject.id) ==
            'string' && data.queryStringObject.id.trim().length == 40 ?
            data.queryStringObject.id.trim() : false
    console.log(data.queryStringObject.id)
    if (id) {
        _data.read('tokens', id, (err, data) => {
            if (!err && data) {
                // Remove the hashed password from the user object
                // before returning to user
                _data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200)
                    } else {
                        callback(500, { Error: 'Could not delete the specified tokens' })
                    }
                })
            } else {
                callback(404, { Error: 'Could not find the specified tokens' })
            }
        })
    } else {
        callback(400, { Error: 'Missing required field' })
    }
}

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = (id, phone, callback) => {
    // Lookup the token
    _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (tokenData.phone == phone && tokenData.expires > Date.now()) {
                callback(true)
            } else {
                callback(false)
            }
        } else {
            callback(false)
        }
    })
}

module.exports = handlers