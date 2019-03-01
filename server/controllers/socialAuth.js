import { httpResponse } from "@helpers/http";
/**
 * @description This takes in the HTTP server request,
 performs the logic and returns the server response with the user object.
 * @param  {HttpRequest} req
 * @param  {HttResponse} res
 * @returns {HttpResponse} Server Response
 */
const socialAuth = (req, res) => {
  return httpResponse(res, {
    statusCode: 200,
    data: req.user
  });
};

export default socialAuth;
