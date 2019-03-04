import Joi from "joi";

export const commentSchema = Joi.object().keys({
  content: Joi.string()
    .trim()
    .required()
    .label("Content")
});
