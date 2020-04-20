const errors = require('./errors')

module.exports=function(param) {
  throw new errors.RequiredParameterError(param)
}
