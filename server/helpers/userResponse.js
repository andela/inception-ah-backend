import { generateJWToken } from "./index";
/**
 * @param  {object} dbUserModel
 * @returns {object} responseObject
 */
const userResponse = ({ dataValues }) => {
  const userToken = generateJWToken(dataValues.id);
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
