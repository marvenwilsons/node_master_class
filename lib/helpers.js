/*
 * Helpers for various tasks
 */

// Dependencies
const crypto = require('crypto')
const config = require('./../config')

 // Container for all the Helpers
 let helpers = {}

// Cteate a SHA256 hash
helpers.hash = (str)=> {
    if(typeof(str) == 'string' && str.length > 0){
        let hash = 
        crypto.createHmac('sha256',config.hashingSecret)
        .update(str)
        .digest('hex')
        
        return hash
    }else {
        return false
    }
}

// Parse a JSON string to an object in all cases, wthout throwing
helpers.parseJsonToObject = (str) => {
    try{
        let obj = JSON.parse(str)
        return obj
    }catch(e){
        return {Error:'test'}
    }
}

// Create a string of random alphanumeric characters of a given length
helpers.createRandomString = (strLen) => {
    strLen = typeof(strLen) == 'number' && strLen > 0 ? strLen : false
    if(strLen){
        // Define characters
        let posibleChar = 'abcdefghijklmnopqrstuvwxy!@#$%^&*+_QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?z0123456789'

        // start the final string
        let str = ''

        for(i = 1; i <= strLen; i++){
            // Get random char
            let randomChar = 
                posibleChar.charAt(Math.floor(Math.random() * posibleChar.length)) 
            // Append to final str
            str+=randomChar
        }

        return str
    } else {
        return false
    }
}

 // Export
 module.exports = helpers