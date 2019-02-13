import { Strategy as facebookStrategy } from "passport-facebook";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import {
  getUserProfileFromApis,
  getOAuthCredentials
} from "../../helpers/passportCallback";

const setPassportMiddleware = passport => {
  passport.use(
    new googleStrategy(getOAuthCredentials("google"), getUserProfileFromApis)
  );
  passport.use(
    new facebookStrategy(
      getOAuthCredentials("facebook"),
      getUserProfileFromApis
    )
  );
};
export default setPassportMiddleware;
