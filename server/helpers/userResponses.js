import { generateJWT, getJWTConfigs } from "./jwt";

const jwtConfigs = getJWTConfigs();

/**
 * @param  {object} dbUserModel
 * @returns {object} responseObject
 */
export const userResponse = ({ dataValues }) => {
  const { id, email, biography, imageURL } = dataValues;
  return {
    id,
    email,
    biography,
    imageURL,
    token: generateJWT(dataValues.id, jwtConfigs)
  };
};

/**
 * @param  {object} dbUserModel
 * @returns {object} responseObject
 */
export const userProfileResponse = ({
  dataValues: {
    id,
    firstName,
    middleName,
    biography,
    lastName,
    gender,
    mobileNumber,
    imageURL
  }
}) => {
  return {
    id,
    firstName,
    middleName,
    lastName,
    gender,
    biography,
    mobileNumber,
    imageURL
  };
};
