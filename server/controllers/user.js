import isEmpty from "lodash.isempty";
import { validateData } from "../validations/validateData";
import { signInSchema } from "../validationSchemas/user";
import { comparePassword } from "../helpers/password";
import { httpResponse, serverError } from "../helpers/http";
import { getBaseUrl } from "../helpers/userHelpers";
import userResponse from "../helpers/userResponse";
import models from "../models";

const { Users } = models;
/**
 * @description Generate login access token for a user
 *
 * @param {Request}  req
 * @param {httpResponse} res
 * @returns {object} HttpResponse {statusCode:int, success:boolean, data:object, message:string}
 */
export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const validated = await validateData({ email, password }, signInSchema);
    if (isEmpty(validated)) {
      const user = await Users.findOne({ where: { email } });
      if (user) {
        const foundUser = user.get("password");
        const matchedPassword = await comparePassword(password, foundUser);
        if (matchedPassword) {
          return httpResponse(res, {
            statusCode: 200,
            success: true,
            message: "login successful",
            data: userResponse(user)
          });
        }
      }
    }
    return httpResponse(res, {
      statusCode: 401,
      success: false,
      message: "Invalid login credentials",
      data: null
    });
  } catch (err) {
    return serverError(res, err);
  }
};

export const passwordResetRequest = async (req, res) => {
  const { email } = req.body;
  try {
    const verifiedUser = await Users.findOne({
      where: {
        email,
        isVerified: true
      }
    });
    if (verifiedUser) {
      const url = `${getBaseUrl(req)}/users/resetPassword`;
      await verifiedUser.sendPasswordResetEmail(url);
      return httpResponse(res, {
        success: true,
        statusCode: 200,
        message: `Email Sent Successfully to your email, `.concat(
          "check your Spam in case you did not find it in your inbox"
        ),
        data: await verifiedUser.generateResetToken()
      });
    }
    return httpResponse(res, {
      success: false,
      statusCode: 404,
      message: "Invalid Email or You are not verified"
    });
  } catch (error) {
    return serverError(res, error);
  }
};

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const user = await Users.findOne({
      where: {
        resetToken: token
      }
    });
    if (user) {
      await user.resetPassword(password, token);
      return httpResponse(res, {
        success: true,
        statusCode: 200,
        message: "Password changed Successfully",
        data: userResponse(user)
      });
    }
    return httpResponse(res, {
      statusCode: 400,
      message: "Password Reset Failed, try again"
    });
  } catch (error) {
    return serverError(res, error);
  }
};
