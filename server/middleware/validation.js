const Joi = require('joi');

// Full schema for POST
const horseSchemaPost = Joi.object({
  name: Joi.string().required(),
  breed: Joi.string().required(),
  age: Joi.number().integer().min(0).required(),
  gender: Joi.string().valid('stallion', 'mare', 'gelding').required(),
  stats: Joi.object({
    speed: Joi.number().min(0).max(100).required(),
    stamina: Joi.number().min(0).max(100).required(),
    agility: Joi.number().min(0).max(100).required()
  }).required(),
  traits: Joi.object({
    coatColor: Joi.string().required(),
    markings: Joi.string().allow('', null)
  }).required()
});

// Partial schema for PUT - all optional, but if present must be valid
const horseSchemaPut = Joi.object({
  name: Joi.string(),
  breed: Joi.string(),
  age: Joi.number().integer().min(0),
  gender: Joi.string().valid('stallion', 'mare', 'gelding'),
  stats: Joi.object({
    speed: Joi.number().min(0).max(100),
    stamina: Joi.number().min(0).max(100),
    agility: Joi.number().min(0).max(100)
  }).min(1),  // <- allow at least one key, but partial is OK
  traits: Joi.object({
    coatColor: Joi.string(),
    markings: Joi.string().allow('', null)
  }).min(1)
});

function validateHorsePost(req, res, next) {
  const { error } = horseSchemaPost.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
}

function validateHorsePut(req, res, next) {
  console.log('Validating PUT with body:', req.body);
  const { error } = horseSchemaPut.validate(req.body);
  if (error) {
    console.log('Joi validation error:', error.details);
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

module.exports = { validateHorsePost, validateHorsePut };