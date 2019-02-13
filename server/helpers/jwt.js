import jwt from "jsonwebtoken";

/**
 * @description This method accepts user object and 
 returns the requested token for the user

 * @param {object}  userId
 * @returns {String}  jwtToken  
 */
export const generateJWT = userId => {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
};

export const verifyJWT = (token, secret = process.env.JWT_SECRET) => {
  return jwt.verify(token, secret);
};
