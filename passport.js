// passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import User from "./models/UserModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/oauth2/redirect/google",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const profileDetails = profile._json;

      console.log("profile", profileDetails);
      const user = await User.findOne({ googleId: profile.id });
      if (user) {
        console.log("user", user);
        return done(null, user);
      }
      const newUser = await User.create({
        fullname: profileDetails.name,
        email: profileDetails.email,
        username: profileDetails.name,
        googleId: profileDetails.id,
        profilePicture: profileDetails.picture,
      });
      console.log("newUser", newUser);
      return done(null, newUser);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
