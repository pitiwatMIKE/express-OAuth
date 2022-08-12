const passport = require("passport"),
  passportJWT = require("passport-jwt"),
  ExtractJWT = passportJWT.ExtractJwt,
  JWTStrategy = passportJWT.Strategy,
  LocalStrategy = require("passport-local").Strategy,
  FacebookStrategy = require("passport-facebook"),
  GoogleStrategy = require("passport-google-oauth20");

const bcrypt = require("bcrypt");
const User = require("../db/models/user");

// local
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, cb) => {
      const user = await User.findOne({ email: email, provider: "local" });

      if (!user) return cb(null, false, { message: "Not Found User" });

      bcrypt.compare(password, user.password, function (err, result) {
        if (!result) return cb(null, false, { message: "Incorrect password." });

        // user correct
        cb(
          null,
          {
            id: user.id,
            email: user.email,
            provider: user.provider,
          },
          { message: "Logged In With local Successfully" }
        );
      });
    }
  )
);

// facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL + "/auth/facebook/callback",
      profileFields: ["id", "email", "displayName", "photos"],
    },
    async (_accessToken, _refreshToken, profile, cb) => {
      let email = profile._json.email;
      const user = await User.findOne({ email: email, provider: "facebook" });

      if (!user) {
        const create = new User({ email: email, provider: "facebook" });
        const result = await create.save();
        cb(
          {
            id: result.id,
            email: result.email,
            provider: result.provider,
          },
          { message: "login with facebook success" }
        );
      } else {
        cb(
          null,
          {
            id: user.id,
            email: user.email,
            provider: user.provider,
          },
          { message: "login with facebook success" }
        );
      }
    }
  )
);

// google
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL + "/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, cb) => {
      let email = profile._json.email;
      const user = await User.findOne({ email: email, provider: "google" });

      if (!user) {
        const create = new User({ email: email, provider: "google" });
        const result = await create.save();
        cb(
          {
            id: result.id,
            email: result.email,
            provider: result.provider,
          },
          { message: "login with google success" }
        );
      } else {
        cb(
          null,
          {
            id: user.id,
            email: user.email,
            provider: user.provider,
          },
          { message: "login with google success" }
        );
      }
    }
  )
);

// JWT
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, cb) => {
      return cb(null, { ...jwtPayload });
    }
  )
);
