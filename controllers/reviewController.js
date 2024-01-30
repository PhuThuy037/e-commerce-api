const Review = require("../models/Review");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");
const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError("Cant find products");
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const review = await Review.find({}).populate({
    path: "product",
    select: "name price",
  });
  res.status(StatusCodes.OK).json({ review, count: review.length });
};
const getSingleReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id }).populate({
    path: "product",
    select: "name price",
  });
  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new CustomError.BadRequestError("No review for this");
  }
  checkPermissions(req.user, review.user);

  await review.remove();
  res
    .status(StatusCodes.OK)
    .json({ msg: "you delete this after all this time" });
};
const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new CustomError.BadRequestError("No review for this");
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  review.save();
  res.status(StatusCodes.OK).json({ msg: "ok" });
};
const getSingleProductReview = async (req, res) => {
  const { id } = req.params;
  const reviews = await Review.find({ product: id });
  res.status(StatusCodes.OK).json({ reviews });
};
module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReview,
};
