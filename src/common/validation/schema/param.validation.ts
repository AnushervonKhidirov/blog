import Joi from 'joi';

export const paramId = Joi.object({
  id: Joi.number().required(),
});
