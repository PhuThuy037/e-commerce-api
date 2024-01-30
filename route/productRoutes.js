const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");
const {
  authenticateUser,
  authPermission,
} = require("../middleware/authentication");
const express = require("express");
const router = express.Router();
const { getSingleProductReview } = require("../controllers/reviewController");
router
  .route("/")
  .get(getAllProducts)
  .post([authenticateUser, authPermission("admin")], createProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authPermission("admin")], updateProduct)
  .delete([authenticateUser, authPermission("admin")], deleteProduct);

router
  .route("/uploadImage")
  .post([authenticateUser, authPermission("admin")], uploadImage);

router.route("/:id/reviews").get(getSingleProductReview);
module.exports = router;
