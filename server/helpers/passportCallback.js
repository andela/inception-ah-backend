import userResponse from "./userResponse";
import database from "../models/index";

const User = database["Users"];
const performCallback = (token, tokenSecret, profile, done) => {
  process.nextTick(async () => {
    try {
      const foundUser = await User.findOne({
        where: {
          email: profile.emails[0].value
        }
      });
      if (!foundUser || Object.keys(foundUser).length === 0) {
        const displayName = profile.displayName.split(" ");
        const newUser = await User.create({
          email: profile.emails[0].value,
          lastName: displayName[0],
          firstName: displayName[1],
          middleName: displayName[2] || "",
          imageURL: profile.photos[0].value,
          gender: profile.gender || "",
          password: ""
        });
        return done(null, userResponse(newUser));
      }
      return done(null, userResponse(foundUser));
    } catch (error) {
      return done(error, null);
    }
  });
};
export default performCallback;
