import jwt from "jsonwebtoken";

const { JWT_SECRET, JWT_ISSUER, JWT_SUBJECT } = process.env;

/**
 * @description This method accepts user object and 
 returns the requested token for the user

 * @param {object}  userId
 * @returns {String}  jwtToken  
 */
export const generateJWT = userId => {
  return jwt.sign({ userId }, JWT_SECRET, {
    issuer: JWT_ISSUER,
    subject: JWT_SUBJECT
  });
};

export const verifyJWT = (token, secret = JWT_SECRET) => {
  return jwt.verify(token, secret, {
    issuer: JWT_ISSUER,
    subject: JWT_SUBJECT
  });
};
