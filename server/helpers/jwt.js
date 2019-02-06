import jwt from "jsonwebtoken";

/**
 * @description This method accepts user object and 
 returns the requested token for the user
 * @param {object}  user
 * @returns {String}  jwtToken  
 */
const generateJwtToken = user => {
  const { id, email, isAdmin } = user;
  return jwt.sign(
    {
      id,
      email,
      isAdmin
    },
    process.env.JWT_SECRET
  );
};

export default generateJwtToken;
