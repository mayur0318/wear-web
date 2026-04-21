const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const DBConnection = require("m:/backup-wear web/wear-web/wearweb-backend/src/utils/DBConnection");
DBConnection();

const authRoutes = require("m:/backup-wear web/wear-web/wearweb-backend/src/routes/AuthRoutes");
app.use("/api/auth", authRoutes);

const adminRoutes = require("m:/backup-wear web/wear-web/wearweb-backend/src/routes/AdminRoutes");
app.use("/api/admin", adminRoutes);

const vendorPanelRoutes = require("m:/backup-wear web/wear-web/wearweb-backend/src/routes/VendorPanelRoutes");
app.use("/api/vendor", vendorPanelRoutes);

const userRoutes = require("m:/backup-wear web/wear-web/wearweb-backend/src/routes/UserRoutes");
app.use("/user", userRoutes);

const customerRoutes = require("m:/backup-wear web/wear-web/wearweb-backend/src/routes/CustomerRoutes");
app.use("/customer", customerRoutes);

const vendorRoutes = require("m:/backup-wear web/wear-web/wearweb-backend/src/routes/VendorRoutes");
app.use("/vendor", vendorRoutes);

const productRoutes = require("m:/backup-wear web/wear-web/wearweb-backend/src/routes/ProductRoutes");
app.use("/product", productRoutes);

const categoryRoutes = require("m:/backup-wear web/wear-web/wearweb-backend/src/routes/CategoryRoutes");
app.use("/category", categoryRoutes);

const cartRoutes = require("m:/backup-wear web/wear-web/wearweb-backend/src/routes/CartRoutes");
app.use("/cart", cartRoutes);

const orderRoutes = require("m:/backup-wear web/wear-web/wearweb-backend/src/routes/OrderRoutes");
app.use("/order", orderRoutes);

const paymentRoutes = require("m:/backup-wear web/wear-web/wearweb-backend/src/routes/PaymentRoutes");
app.use("/payment", paymentRoutes);

const reviewRoutes = require("m:/backup-wear web/wear-web/wearweb-backend/src/routes/ReviewRoutes");
app.use("/review", reviewRoutes);

const PORT = process.env.PORT;
app.listen(3000, () => {
  console.log(`server started on port 3000`);
});
