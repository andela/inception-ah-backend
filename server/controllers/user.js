import isEmpty from "lodash.isempty";
import database from "../models/index";
import { validateData } from "../validations/validateData";
import { signInSchema } from "../validationSchemas/user";
import { generateJWT } from "../helpers/jwt";
import { comparePassword } from "../helpers/password";
import { httpResponse } from "../helpers/http";

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
      const user = await database["Users"].findOne({ where: { email } });
      if (user) {
        const foundUser = user.get("password");
        const matchedPassword = await comparePassword(password, foundUser);
        if (matchedPassword) {
          const jwtoken = await generateJWT(user.get("id"));
          return httpResponse(res, {
            statusCode: 200,
            success: true,
            message: "login successful",
            data: { token: jwtoken }
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
    return httpResponse(res, {
      statusCode: 500,
      success: false,
      message: "An Internal server occured",
      data: null
    });
  }
};
