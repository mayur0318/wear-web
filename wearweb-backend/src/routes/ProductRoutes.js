const router = require("express").Router();
const productController = require("../controllers/ProductController");
const upload = require("../middleware/UploadMiddleware");

router.post(
  "/product",
  upload.single("image"),
  productController.createProduct,
);
router.get("/products", productController.getAllProducts);
router.get("/product/:id", productController.getProductById);
router.get("/searchProduct", productController.searchProduct);
router.delete("/product/:id", productController.deleteProduct);
router.put("/product/:id", productController.updateProduct);

module.exports = router;
