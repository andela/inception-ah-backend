import Joi from "joi";
import { errorFormatter } from "@validations/validator";

/**
 * @description Get name validation schema
 *
 * @param {string} label the text to use instead of field name in the error message;
 
 * @returns {string} Instance of JOI validation schema
 * @method getNameSchema
 */
const getNameSchema = label => {
  const exp = /^[\w'\-,.][^0-9_¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
  return Joi.string()
    .required()
    .trim()
    .min(2)
    .regex(exp)
    .lowercase()
    .label(label)
    .error(errors => errorFormatter(errors, label));
};

const firstName = getNameSchema("First name");
const lastName = getNameSchema("Last name");
const email = Joi.string()
  .email()
  .required()
  .trim()
  .label("Email")
  .lowercase();

const password = Joi.string()
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{6,}$/)
  .min(6)
  .required()
  .trim()
  .label("Password")
  .error(errors => {
    return errorFormatter(
      errors,
      "Password",
      "Password must be atleast 6 chars with atleast 1 uppercase, 1 number, & 1 special char"
    );
  });

const middleName = Joi.string()
  .allow("")
  .trim()
  .strict()
  .label("Middle name");

const gender = Joi.string()
  .allow("")
  .trim()
  .strict()
  .label("Gender");

const biography = Joi.string()
  .allow("")
  .trim()
  .strict()
  .label("Biography");

const mobileNumber = Joi.string()
  .allow("")
  .trim()
  .strict()
  .label("Mobile number");

const imageURL = Joi.string()
  .allow("")
  .trim()
  .strict()
  .label("Image URL");

export const signUpSchema = Joi.object().keys({
  firstName,
  lastName,
  email,
  password
});

export const signInSchema = Joi.object().keys({
  email: Joi.string()
    .trim()
    .required(),
  password: Joi.string()
    .trim()
    .required()
});

export const updateProfileSchema = Joi.object().keys({
  firstName,
  middleName,
  lastName,
  gender,
  biography,
  mobileNumber,
  imageURL
});
