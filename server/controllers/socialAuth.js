/**
 * @description This takes in the HTTP server request,
 performs the logic and returns the server response with the user object.
 * @param  {HttpRequest} req
 * @param  {HttResponse} res
 * @returns {HttpResponse} Server Response
 */
const socialAuth = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};

export default socialAuth;
