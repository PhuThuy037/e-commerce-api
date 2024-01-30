const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const createProduct = async (req, res) => {
  // const {
  //   name,
  //   price,
  //   description,
  //   image,
  //   category,
  //   company,
  //   colors,
  //   featured,
  //   freeShipping,
  //   inventory,
  //   averageRating,
  // } = req.body;
  const user = req.body;
  user.user = req.user.userId;
  const product = await Product.create(user);
  res.status(StatusCodes.CREATED).json({ product });
};
const getAllProducts = async (req, res) => {
  const product = await Product.find({});

  res.status(StatusCodes.OK).json({ product }).sorr("createdAt");
};
const getSingleProduct = async (req, res) => {
  const product = await Product.find({ _id: req.params.id }).populate(
    "reviews"
  );
  if (!product) {
    throw new CustomError.UnauthoziError("Cant find product");
  }
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new CustomError.UnauthoziError("Cant find product");
  }
  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new CustomError.NotFoundError("Cant find product");
  }
  product.remove();
  res.status(StatusCodes.OK).json({ msg: "Success" });
};
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please Upload Image");
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload image smaller than 1MB"
    );
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};
module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
