const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authPermission,
} = require("../middleware/authentication");

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderController");
const { model } = require("mongoose");
router.route("/showAllMyOrders").get(getCurrentUserOrders);
router
  .route("/")
  .get(authenticateUser, authPermission("admin"), getAllOrders)
  .post(authenticateUser, createOrder);
router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

module.exports = router;
