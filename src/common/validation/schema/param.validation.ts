import Joi from 'joi';

export const paramId = Joi.object({
  id: Joi.number().required(),
});

export const paramUserId = Joi.object({
  userId: Joi.number(),
});
