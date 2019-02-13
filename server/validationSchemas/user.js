import Joi from "joi";

const firstName = Joi.string()
  .min(2)
  .required()
  .label("First name");
const lastName = Joi.string()
  .min(2)
  .required()
  .label("Last name");
const email = Joi.string()
  .min(2)
  .required()
  .label("Email");
const password = Joi.string()
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{6,}$/)
  .min(6)
  .error(() => {
    return {
      message:
        "Password must be atleast 6 chars with atleast 1 uppercase, 1 number, & 1 special char"
    };
  })
  .required();

export const signUpSchema = Joi.object().keys({
  firstName,
  lastName,
  email,
  password
});

export const signInSchema = Joi.object().keys({
  email,
  password
});
