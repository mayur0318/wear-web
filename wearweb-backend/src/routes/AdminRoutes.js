const router = require("express").Router();
const adminController = require("../controllers/AdminController");
const { verifyToken, requireRole } = require("../middleware/AuthMiddleware");

// All admin routes require JWT + admin role
router.use(verifyToken, requireRole("admin"));

// Vendor management
router.get("/vendor-requests", adminController.getVendorRequests);
router.put("/vendors/:id/approve", adminController.approveVendor);
router.put("/vendors/:id/reject", adminController.rejectVendor);

// Sub-admin management
router.get("/admins", adminController.getAllAdmins);
router.post("/admins/create", adminController.createSubAdmin);
router.delete("/admins/:id", adminController.removeAdmin);

module.exports = router;
