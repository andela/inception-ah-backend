import { Strategy as facebookStrategy } from "passport-facebook";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import performCallback from "../../helpers/passportCallback";
import getAuthCredentials from "../../helpers/passportCredentials";

const setPassportMiddleware = passport => {
  passport.use(
    new googleStrategy(getAuthCredentials("google"), performCallback)
  );
  passport.use(
    new facebookStrategy(getAuthCredentials("facebook"), performCallback)
  );
};
export default setPassportMiddleware;
