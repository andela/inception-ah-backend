import { generateJWT } from "./jwt";
/**
 * @param  {object} dbUserModel
 * @returns {object} responseObject
 */
const userResponse = ({ dataValues }) => {
  const userToken = generateJWT(dataValues.id);
  const { id, email, biography, imageURL } = dataValues;
  return {
    id,
    email,
    token: userToken,
    biography,
    imageURL
  };
};

export default userResponse;
