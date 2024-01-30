const { func } = require("joi");
const mongoose = require("mongoose");

const ReviewChema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide title"],
    },
    comment: {
      type: String,
      required: [true, "Please provide rating"],
    },
    numOfReview: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewChema.index({ product: 1, user: 1 }, { unique: 1 });
ReviewChema.statics.calculateAvgRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        numOfReview: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        avgRating: Math.ceil(result[0]?.avgRating || 0),
        numOfReview: result[0]?.numOfReview || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};
ReviewChema.post("save", async function () {
  await this.constructor.calculateAvgRating(this.product);
});

ReviewChema.post("remove", async function () {
  await this.constructor.calculateAvgRating(this.product);
});
module.exports = mongoose.model("Review", ReviewChema);
