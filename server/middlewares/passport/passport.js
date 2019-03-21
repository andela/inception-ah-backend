import passport from "passport";
import { Strategy as facebookStrategy } from "passport-facebook";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import {
  getUserProfileFromApis,
  getOAuthCredentials
} from "@helpers/passportCallback";

export const googleAuth = () => {
  return passport.authenticate("google", {
    scope: ["profile", "email"]
  });
};

export const googleAuthRedirect = () => {
  return passport.authenticate("google", { session: false });
};

export const facebookAuth = () => {
  return passport.authenticate("facebook", { scope: ["email"] });
};

export const facebookAuthRedirect = () => {
  return passport.authenticate("facebook", { session: false });
};

export const setPassportMiddleware = passportOAuth => {
  passportOAuth.use(
    new googleStrategy(getOAuthCredentials("google"), getUserProfileFromApis)
  );
  passportOAuth.use(
    new facebookStrategy(
      getOAuthCredentials("facebook"),
      getUserProfileFromApis
    )
  );
};
