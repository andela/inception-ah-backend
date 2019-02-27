import Joi from "joi";
import { signInSchema, signUpSchema, updateProfileSchema } from "./user";
import { articleSchema } from "./article";

const uuidSchema = Joi.string().uuid();

export {
  uuidSchema,
  signInSchema,
  signUpSchema,
  articleSchema,
  updateProfileSchema
};
