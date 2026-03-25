const router = require("express").Router();
const customerController = require("../controllers/CustomerController");

router.get("/customers", customerController.getAllCustomer);
router.get("/customer/:id", customerController.getCustomerById);
router.get("/customer/:id", customerController.getCustomerByUserId);
router.put("/customer/:id", customerController.updateCustomer);
router.delete("/customer/:id", customerController.deleteCustomer);

module.exports = router;
