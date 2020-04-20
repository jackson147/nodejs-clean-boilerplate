const RequiredParameterError = require('./errors').RequiredParameterError

module.exports=function(param) {
  throw new RequiredParameterError(param)
}
