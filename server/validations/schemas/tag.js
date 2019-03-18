import Joi from "joi";
import { errorFormatter } from "@validations/validator";

export const tagSchema = Joi.object().keys({
  tag: Joi.string()
    .min(2)
    .trim()
    .required()
});

export const tagsSchema = Joi.array()
  .items(Joi.string())
  .unique((string1, string2) => {
    return string1.trim().toLowerCase() === string2.trim().toLowerCase();
  })
  .allow(["", null])
  .error(errors => errorFormatter(errors, null, "Duplicate tags not allowed"));
