const router = require("express").Router();
const vendorController = require("../controllers/VendorController");

router.get("/vendors", vendorController.getAllVendors);
router.get("/vendor/:id", vendorController.getVendorById);
router.get("/vendor/:id", vendorController.getVendorByUserId);
router.put("/vendor/:id", vendorController.updateVendor);
router.delete("/vendor/:id", vendorController.deleteVendor);
module.exports = router;
