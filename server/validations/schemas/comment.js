import Joi from "joi";

export const commentSchema = Joi.object().keys({
  articleId: Joi.string().uuid(),
  content: Joi.string()
    .trim()
    .required()
    .label("Content")
});
