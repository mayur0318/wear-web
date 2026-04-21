const router = require("express").Router();
const userController = require("../controllers/UserController");
const passwordController = require("../controllers/PasswordController");
const upload = require("../middleware/UploadMiddleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/users", userController.getAllUsers);
router.delete("/user/:id", userController.deleteUser);
router.get("/user/:id", userController.getUserById);
router.put("/user/:id", upload.single("profilePicture"), userController.updateUserById);
router.post("/change-password", passwordController.changePassword);

module.exports = router;
