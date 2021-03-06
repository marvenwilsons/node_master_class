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
        const hash = 
        crypto.createHmac('sha256',config.hashingSecret)
        .update(str)
        .digest('hes')
        
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

 // Export
 module.exports = helpers