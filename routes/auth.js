const router = require("express").Router();
const passport = require("passport");

const { generateJwtToken } = require("../utils/generateToken");

// login with local
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) return res.status(422).json({ message: info });

    const token = generateJwtToken(user);
    res.json({ ...user, token });
  })(req, res, next);
});

// login with facebook
router.get("/facebook", passport.authenticate("facebook"));

router.get("/facebook/callback", (req, res, next) => {
  passport.authenticate("facebook", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) return res.status(422).json({ message: info });

    const token = generateJwtToken(user);
    res.json({ ...user, token });
  })(req, res, next);
});

// login with google
router.get("/google", passport.authenticate("google", { scope: ["email"] }));

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) return res.status(422).json({ message: info });

    const token = generateJwtToken(user);
    res.json({ ...user, token });
  })(req, res, next);
});

module.exports = router;
