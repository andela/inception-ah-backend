import Joi from "joi";
import { errorFormatter } from "@validations/validator";
import { tagsSchema } from "./tag";

export const articleSchema = Joi.object().keys({
  title: Joi.string()
    .min(10)
    .trim()
    .required()
    .label("Title"),
  description: Joi.string()
    .min(20)
    .required()
    .label("Description"),
  content: Joi.string()
    .min(200)
    .required()
    .label("Content"),
  categoryId: Joi.string()
    .required()
    .label("Category")
    .error(errors => errorFormatter(errors, null, "Please select a category")),
  tags: tagsSchema
});
