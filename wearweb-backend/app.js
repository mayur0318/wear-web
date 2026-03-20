const express = require("express");
const app = express();
require("dotenv").config();

const DBConnection = require("./src/utils/DBConnection");
DBConnection();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
