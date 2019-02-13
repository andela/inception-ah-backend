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
  .email()
  .required()
  .label("Email");
const password = Joi.string()
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-.]).{6,}$/)
  .min(6)
  .error(() => {
    return {
      message:
        "Password must be atleast 6 chars with atleast 1 uppercase, 1 number, & 1 special char"
    };
  })
  .required();

const confirmPassword = Joi.string()
  .valid(Joi.ref("password"))
  .required()
  .error(() => {
    return {
      message: "Password must match"
    };
  });

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

export const passwordResetRequestSchema = Joi.object().keys({
  email
});

export const passwordResetSchema = Joi.object().keys({
  password,
  confirmPassword
});
