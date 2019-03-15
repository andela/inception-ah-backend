import Joi from "joi";

export const uuidSchema = Joi.object().keys({
  uuid: Joi.string().uuid()
});
