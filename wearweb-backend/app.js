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

const productRoutes = require("./src/routes/ProductRoutes");
app.use("/product", productRoutes);

const categoryRoutes = require("./src/routes/CategoryRoutes");
app.use("/category", categoryRoutes);

const cartRoutes = require("./src/routes/CartRoutes");
app.use("/cart", cartRoutes);

const orderRoutes = require("./src/routes/OrderRoutes");
app.use("/order", orderRoutes);

const paymentRoutes = require("./src/routes/PaymentRoutes");
app.use("/payment", paymentRoutes);

const reviewRoutes = require("./src/routes/ReviewRoutes");
app.use("/review", reviewRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
