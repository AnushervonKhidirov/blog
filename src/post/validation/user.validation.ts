import Joi from 'joi';

export const CreatePostValidation = Joi.object({
  title: Joi.string().required(),
  text: Joi.string().required(),
});

export const UpdatePostValidation = Joi.object({
  title: Joi.string(),
  text: Joi.string(),
});
