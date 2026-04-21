const router = require("express").Router();
const userController = require("../controllers/UserController");
const passwordController = require("../controllers/PasswordController");

router.post("/vendor-signup", userController.vendorSignup);
router.post("/forgot-password", passwordController.forgotPassword);
router.post("/reset-password/:token", passwordController.resetPassword);

module.exports = router;
