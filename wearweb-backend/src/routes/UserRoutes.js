const router = require("express").Router();
const userController = require("../controllers/UserController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/users", userController.getAllUsers);
router.delete("/user/:id", userController.deleteUser);
router.get("/user/:id", userController.getUserById);
router.put("user/:id", userController.updateUserById);

module.exports = router;
