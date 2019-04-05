export const isProd = process.env.NODE_ENV === "production";

// Load Credentials from environment settings

const {
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_ID_PROD,
  FACEBOOK_REDIRECT_PROD,
  FACEBOOK_CLIENT_SECRET,
  FACEBOOK_CLIENT_SECRET_PROD,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_PROD,
  PORT,
  FRONTEND_LINK,
  FRONTEND_LINK_DEV
} = process.env;

export const socialAuthConfig = {
  facebook: isProd
    ? {
        clientID: FACEBOOK_CLIENT_ID_PROD,
        clientSecret: FACEBOOK_CLIENT_SECRET_PROD,
        callbackURL: FACEBOOK_REDIRECT_PROD,
        profileFields: ["id", "displayName", "photos", "email"]
      }
    : {
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: `http://localhost:${PORT}/api/v1/auth/facebook/redirect`,
        profileFields: ["id", "displayName", "photos", "email"]
      },
  google: {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: isProd
      ? GOOGLE_REDIRECT_PROD
      : `http://localhost:${PORT}/api/v1/auth/google/redirect`
  }
};

export const frontEndLink = FRONTEND_LINK;
export const frontEndLinkDev = FRONTEND_LINK_DEV;
