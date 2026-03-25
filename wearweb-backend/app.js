const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const DBConnection = require("./src/utils/DBConnection");
DBConnection();

const userRoutes = require("./src/routes/UserRoutes");
app.use("/user", userRoutes);

const customerRoutes = require("./src/routes/CustomerRoutes");
app.use("/customer", customerRoutes);

const vendorRoutes = require("./src/routes/VendorRoutes");
app.use("/vendor", vendorRoutes);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
