const { validationResult } = require('express-validator')

/* 
 Checks to see if there was any errors in the previous middleware the was called in the 
 express-validator methods.
*/
const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(400).json({
      errors: extractedErrors,
    })
}

module.exports = validate



