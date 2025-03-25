import Joi from 'joi';

export const CreateUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  birthDate: Joi.date().required(),
});

export const UpdateUserValidation = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(8),
  firstName: Joi.string(),
  lastName: Joi.string(),
  birthDate: Joi.date(),
});
