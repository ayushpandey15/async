let Joi                  = require('joi');

exports.validator        = validator;

function validator(req, res, next) {
    console.log("=======Validating========");

    let schema = Joi.object().keys({
        first_no   : Joi.number().options({convert : false}).required(),
        second_no  : Joi.number().options({convert : false}).required()
    });

    var validFields = validateFields( req.body, res, schema);
    if (validFields) {
        next();
    }
}

function validateFields(req, res, schema) {
   console.log("the req body is.....",req);
    var validation = Joi.validate(req, schema);
    if(validation.error) {
      var errorReason =
            validation.error.details !== undefined
              ? validation.error.details[0].message
              : 'Parameter missing or parameter type is wrong';
              res.status(400).send(errorReason);      
      return false;
    }
    return true;
}