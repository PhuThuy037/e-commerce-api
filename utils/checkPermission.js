const CustomError = require("../errors");
const checkPermissions = (reqUser, reqId) => {
  if (reqUser.role === "admin") {
    return;
  }
  if (reqUser.userId === reqId.toString()) return;
  throw new CustomError.UnauthenticatedError("You dont permission");
};
module.exports = checkPermissions;
