import socialAuthConfig from "../configs/passport";

const getAuthCredentials = platform => {
  return socialAuthConfig[platform];
};

export default getAuthCredentials;
