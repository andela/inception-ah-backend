import queryString from "querystring";
import { frontEndLink, isProd, frontEndLinkDev } from "@configs/passport";

const url = isProd ? frontEndLink : frontEndLinkDev;
/**
 * @description This takes in the HTTP server request,
 performs the logic and returns the server response with the user object.
 * @param  {HttpRequest} req
 * @param  {HttResponse} res
 * @returns {HttpResponse} Server Response
 */

export const socialAuth = (req, res, next) => {
  return res.redirect(
    301,
    `${url}?${queryString.stringify({
      token: req.user.token,
      error: req.user.error
    })}`
  );
};
