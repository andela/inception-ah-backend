import isEmpty from "lodash.isempty";
import { comparePassword } from "@helpers/password";
import { serverError, httpResponse } from "@helpers/http";
import { generateJWT, decodeJWT, getJWTConfigs } from "@helpers/jwt";
import models from "@models";
import {
  getBaseUrl,
  sanitize,
  userResponse,
  userProfileResponse
} from "@helpers/users";

const { Users } = models;
const verificationJWTConfigs = getJWTConfigs({ option: "verification" });
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
    const user = await Users.findOne({ where: { email } });
    if (user) {
      const foundUser = user.get("password");
      const matchedPassword = await comparePassword(password, foundUser);
      if (matchedPassword) {
        const authJWTConfings = getJWTConfigs({ option: "authentication" });
        const payload = {
          userId: user.get("id")
        };
        const token = await generateJWT(payload, authJWTConfings);
        return httpResponse(res, {
          statusCode: 200,
          success: true,
          message: "login successful",
          userId: user.get("id"),
          data: { token }
        });
      }
    }
    return httpResponse(res, {
      statusCode: 401,
      success: false,
      message: "Invalid login credentials",
      data: null
    });
  } catch (err) {
    return httpResponse(res, {
      statusCode: 500,
      success: false,
      message: "An Internal server error occured",
      data: null
    });
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
  const { token } = req.query;

  try {
    const foundUser = await Users.findOne({
      where: {
        resetToken: token
      }
    });
    if (foundUser) {
      await foundUser.resetPassword(password, token);
      return httpResponse(res, {
        success: true,
        statusCode: 200,
        message: "Password changed Successfully",
        data: userResponse(foundUser)
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

/**
 * @description Sign up a new user
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object} HTTP response
 * @method userSignUp
 */
export const userSignUp = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    const newUser = await Users.create({
      firstName,
      lastName,
      email,
      password: req.body.password
    });
    const { password, ...user } = newUser.dataValues;
    const token = generateJWT({ userId: user.id }, verificationJWTConfigs);
    newUser.sendVerificationEmail(
      `${getBaseUrl(req)}/auth/verification/?token=${token}`
    );
    const message = `Sign up was successfull. Please check your email to activate your account!
      If you don't find it in your inbox, please check your spam messages.`;
    return httpResponse(res, {
      statusCode: 201,
      // backtick preserves white spaces and add a newline character;
      // so, we need to sanitize the message being returned to the client
      message: sanitize(message, false).replace("\n", ""),
      user
    });
  } catch (error) {
    return serverError(res, error);
  }
};

/**
 * Verifies a new user registration
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @returns {object} HTTP response
 */
export const verifyUserAccount = async (req, res) => {
  try {
    const decoded = decodeJWT(req.query.token, verificationJWTConfigs);
    let foundUser = await Users.findByPk(decoded.userId);
    if (!isEmpty(foundUser)) {
      // If account has previously been verified
      // return the appropriate message
      if (foundUser.get("isVerified")) {
        return httpResponse(res, {
          statusCode: 200,
          message: "Account has been verified"
        });
      }
      return httpResponse(res, {
        message: "Account verification was successfull",
        // activate user account and return response to client
        user: userResponse(await foundUser.activateAccount())
      });
    }
    return httpResponse(res, {
      statusCode: 404,
      message: "Sorry, user does not exist"
    });
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * @description Fetch user profile
 *
 * @param {Request}  req
 * @param {httpResponse} res
 * @returns {object} HttpResponse {statusCode:int, success:boolean, data:object, message:string}
 */
export const getUserProfile = async (req, res) => {
  const { userDetails } = req;
  return httpResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile retrieved",
    data: userProfileResponse(userDetails)
  });
};

/**
 * @description Update User Profile
 *
 * @param {Request}  req
 * @param {httpResponse} res
 * @returns {object} HttpResponse {statusCode:int, success:boolean, data:object, message:string}
 */
export const updateUserProfile = async (req, res) => {
  const { user } = req;
  try {
    const { userDetails } = req;
    const userIdFromToken = user.userId;
    if (userIdFromToken === userDetails.id) {
      const updatedUserProfile = await userDetails.updateProfile(req.body);
      return httpResponse(res, {
        statusCode: 200,
        success: true,
        message: "User profile updated",
        data: userProfileResponse(updatedUserProfile)
      });
    }

    return httpResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized. Can not update another user's profile"
    });
  } catch (error) {
    return serverError(res, error);
  }
};
