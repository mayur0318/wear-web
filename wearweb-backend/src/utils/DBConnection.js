const mongoose = require("mongoose");
require("dotenv").config();

const DBConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {})
    .catch((e) => {
      console.log(e);
    });
};

module.exports = DBConnection;
