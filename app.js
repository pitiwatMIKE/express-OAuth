const express = require("express");
const passport = require("passport");
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();
require("./db/myDB").connect();
require("./config/passport");

app.use(express.json());

// register
app.use(require("./routes/register"));
// authentication (login)
app.use("/auth", require("./routes/auth"));
// protected
app.use(    
  "/user",
  passport.authenticate("jwt", { session: false }),
  require("./routes/user")
);


//Handler Error
app.use((err, req, res, next) => {
  let statusCode = err.status || 500;
  res.status(statusCode);
  res.json({
    error: {
      status: statusCode,
      message: err.message,
    },
  });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
