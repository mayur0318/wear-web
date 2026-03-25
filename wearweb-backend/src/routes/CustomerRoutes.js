const router = require("express").Router();
const customerController = require("../controllers/CustomerController");

router.get("/customers", customerController.getAllCustomer);

module.exports = router;
