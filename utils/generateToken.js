// Function for generating jwt tokens
var jwt = require("jsonwebtoken");

const generateJwtToken = (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

module.exports = { generateJwtToken };
