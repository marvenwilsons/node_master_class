/*
 * Library for storing and editing data
 */

 // Dependencies
 const fs = require('fs')
 const path = require('path')
 const helpers = require('./helpers')

 // container for the module (to be exported)
 let lib = {}

 // Base directory of the data folder
 lib.baseDir = path.join(__dirname,'/../.data/')

 // Write data to a file
 lib.create = (dir,file,data,callback) => {
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',(err,fileDescriptor) => {
        if(!err && fileDescriptor){
            
            // Convert data to string
            const stringData = JSON.stringify(data)

            // Write to file and close it
            fs.writeFile(fileDescriptor,stringData,(err) => {
                if(!err){
                    fs.close(fileDescriptor,(err) => {
                        if(!err) {
                            callback(false)
                        }else {
                            callback('Error closing new file')
                        }
                    })
                }else {
                    callback('Error writing to new file')
                }
            })
        } else {
            callback('Could not create new file, it may already exist')
        }
    })
 }

 // Read data from a file
 lib.read = (dir,file,callback) => {
     fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err,data) => {
        if(!err && data){
            const parsedData = helpers.parseJsonToObject(data)
            callback(false,parsedData)
        }else {
            callback(err,data)
        }
     })
 }

 // Update data inside a file
 lib.update = (dir,file,data,callback) => {
    fs.open(`${lib.baseDir}${dir}/${file}.json`,'r+',(err,fileDescriptor) => {
        if(!err && fileDescriptor){
            const stringData = JSON.stringify(data)
            
            // truncate
            fs.truncate(fileDescriptor,(err) => {
                if(!err) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor,stringData,(err) => {
                        if(!err) {
                            fs.close(fileDescriptor,(err) => {
                                if(!err) {
                                    callback(false)
                                }else{
                                    callback('Error Closing file')
                                }
                            })
                        } else {
                            callback('Error writing to exisiting file')
                        }
                    })
                } else {
                    callback('Error truncating file')
                }
            })
        } else {
            callback('Could not open the file for updating, it may not exist yet')
        }
    })
 }

 // Delete a file
 lib.delete = (dir,file,callback) => {
     // Unlink the file
     fs.unlink(`${lib.baseDir}${dir}/${file}.json`,(err) => {
        !err ? callback(false) : callback(`Error deleting ${file}`)
     })
 }

 // Export the module
 module.exports = lib