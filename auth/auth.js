const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const { Error } = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy;

const jwtExtractor = (req) => {
  let token = null;
  if (req && req.headers["authorization"]) {
    token = req.headers["authorization"].split(" ")[1]
  }
  return token
}

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: jwtExtractor,
      secretOrKey: process.env.SECRET_WEB_TOKEN,
    },
   async function (jwt_payload, done) {
      try {
        const foundUser = await User.findOne({ _id: jwt_payload.sub })
        done (null, foundUser)
      } catch (error) {
        done(error, null)
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const foundUser = await User.findOne({ googleId: profile.id });

        if (!!foundUser) {
          return done(null, foundUser);
        } else {
          console.log(profile);

          const createUser = await User.create({
            googleId: profile.id,
            firstname: profile._json.name,
            lastname: profile._json.given_name,
            email: profile._json.email,
            pictureurl: profile._json.picture,
          });
          return done(null, createUser);
        }
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const foundUser = await User.findById(id);
    done(null, foundUser);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
