const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { use } = require("../route/userRoutes");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const getAllUsers = async (req, res) => {
  const user = await User.find({ role: "user" }).select("-password");

  res.status(StatusCodes.OK).json(user);
};
const getSingleUser = async (req, res) => {
  console.log(req.params);
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.BadRequestError(`Cant find id ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json(user);
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUserPassword = async (req, res) => {
  const { oldPass, newPass } = req.body;
  if (!oldPass || !newPass) {
    throw new CustomError.BadRequestError("new pass or old pass missing");
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isCorrect = await user.comparePassword(oldPass);
  console.log(isCorrect);
  if (!isCorrect) {
    throw new CustomError.UnauthenticatedError("Pass not mathc");
  }
  user.password = newPass;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "ok please" });
};
const updateUser = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new CustomError.BadRequestError("Email or name missing");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.name = name;
  user.email = email;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ tokenUser });
};
module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
// const updateUser = async (req, res) => {
//   const { email, name } = req.body;

//   if (!email || !name) {
//     throw new CustomError.BadRequestError("Email or name missing");
//   }

//   const user = await User.findOneAndUpdate({ _id: req.user.userId }, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ tokenUser });
// };
