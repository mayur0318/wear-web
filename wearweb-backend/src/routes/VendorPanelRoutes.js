const router = require("express").Router();
const vendorPanelController = require("../controllers/VendorPanelController");
const { verifyVendor } = require("../middleware/RoleMiddleware");
const { verifyToken } = require("../middleware/AuthMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Apply JWT auth first, then vendor role check
router.use(verifyToken, verifyVendor);

// DASHBOARD
router.get("/dashboard", vendorPanelController.getDashboardStats);

// PRODUCTS
router.get("/products", vendorPanelController.getProducts);
router.post("/products", upload.single("imageUrl"), vendorPanelController.addProduct);
router.put("/products/:id", upload.single("imageUrl"), vendorPanelController.updateProduct);
router.delete("/products/:id", vendorPanelController.deleteProduct);
router.put("/products/:id/stock", vendorPanelController.updateStock);

// ORDERS
router.get("/orders", vendorPanelController.getOrders);
router.get("/orders/:id", vendorPanelController.getOrderById);
router.put("/orders/:id/status", vendorPanelController.updateOrderStatus);

// REPORTS
router.get("/reports", vendorPanelController.getReports);

// REVIEWS
router.get("/reviews", vendorPanelController.getReviews);

// PROFILE
router.get("/profile", vendorPanelController.getProfile);
router.put("/profile", vendorPanelController.updateProfile);

module.exports = router;
