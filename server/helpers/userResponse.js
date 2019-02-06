import generateJwtToken from "./jwt";
/**
 * @param  {object} dbUserModel
 * @returns {object} responseObject
 */
const userResponse = ({ dataValues }) => {
  const userToken = generateJwtToken(dataValues);
  const { id, email, biography, imageURL } = dataValues;
  return {
    id,
    email,
    token: userToken,
    bio: biography,
    image: imageURL
  };
};
export default userResponse;
