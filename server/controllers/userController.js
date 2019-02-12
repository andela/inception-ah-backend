import database from "../models/index";
import {
  comparePassword,
  generateJWToken,
  httpResponse
} from "../helpers/index";

/**
 * @description Generate login access token for a user
 *
 * @param {Request}  req
 * @param {httpResponse} res
 * @param {function} next
 * @returns {object} HttpResponse {statusCode:int, success:boolean, data:object, message:string}
 */
export const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await database["Users"].findOne({ where: { email } });
    if (user) {
      const foundPassword = user.get("password");
      const matchePassword = await comparePassword(password, foundPassword);
      if (matchePassword) {
        const jwtoken = await generateJWToken(user.get("id"));
        return httpResponse(res, {
          statusCode: 200,
          success: true,
          message: "success",
          data: { token: jwtoken }
        });
      }
    }
  }
  return httpResponse(res, {
    statusCode: 401,
    success: false,
    message: "Invalid login credential",
    data: null
  });
};
