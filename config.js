/*
 * Create and export configuration variables
 *
 */

 // Container for all environments
 let environments = {}

 // Staging (default) env
 environments.staging = {
    httpPort : 3000,
    httpsPort: 3001,
    envName: 'staging',
 }

 // Production env
 environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production'
 }

 // Determine which evn was passed as cmd arg
 let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' && 
 process.env.NODE_ENV.toLowerCase()

 // Check that the current env is one of the env above, if not default to staging
 let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? 
 environments[currentEnvironment] : environments.staging

 // Export the module
 module.exports = environmentToExport