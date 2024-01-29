const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
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
  const product = await Product.find({ _id: req.params.id });
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
  const product = await Product.findOneAndRemove({ _id: req.params.id });
  res.status(StatusCodes.OK).json({ product });
};
const uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "file-upload",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};
module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
