import Joi from 'joi';

export const SignInValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
