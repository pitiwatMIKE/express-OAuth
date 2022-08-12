const router = require("express").Router();
const User = require("../db/models/user");
const bcrypt = require("bcrypt");
const { generateJwtToken } = require("../utils/generateToken");

router.post("/register", (req, res, next) => {
  const saltRounds = 10;
  const user = req.body.user;

  if (!user) res.status(404).json({ message: "not fond user" });

  bcrypt.hash(user.password, saltRounds, async (err, hash) => {
    user.password = hash;
    user.provider = "local";

    if (err) throw new Error(err);

    try {
      // create user
      const create = new User(user);
      const result = await create.save();
      const getUser = {
        id: result.id,
        email: result.email,
        provider: result.provider,
      };
      const token = generateJwtToken(getUser);

      res.send({
        ...getUser,
        token,
        message: "register success",
      });
    } catch (e) {
      next(e);
    }
  });
});

module.exports = router;
