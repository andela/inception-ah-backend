import passport from "passport";

export const googleAuth = () => {
  return passport.authenticate("google", {
    scope: ["profile", "email"]
  });
};
export const googleAuthRedirect = () => {
  return passport.authenticate("google", { session: false });
};

export const facebookAuth = () => {
  return passport.authenticate("facebook");
};

export const facebookAuthRedirect = () => {
  return passport.authenticate("facebook", { session: false });
};
