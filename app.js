const express = require("express");
require("dotenv").config();
const app = express();
require("express-async-errors");
const notFound = require("./middleware/not-found");
const errHandle = require("./middleware/error-handler");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// connect db
const connectDb = require("./db/connect");

// router
const reviewRoutes = require("./route/reviewRouter");
const productRoutes = require("./route/productRoutes");
const authRouter = require("./route/authRoutes");
const userRouter = require("./route/userRoutes");
const orderRouter = require("./route/orderRoutes");

// secure
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

// middleware
app.use(express.static("./public"));
app.use(fileUpload());
// app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
// app.get("/", (req, res) => {
//   res.status(200).send("Hello word");
// });
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRouter);
app.use(notFound);
app.use(errHandle);
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () => console.log(`sever listen on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
