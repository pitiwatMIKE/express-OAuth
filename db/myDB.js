const mongoose = require("mongoose");

module.exports.connect = function () {
  mongoose.connect(process.env.MONGODB_HOST);
};
