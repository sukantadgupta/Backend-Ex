const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const app = express();
require("dotenv").config();
// -------------------------------------------------------------------------------

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
const errorLogStream = fs.createWriteStream(path.join(__dirname, "error.log"), {
  flags: "a",
});

// -------------------------------------------------------------------------------

// a mechanism by which a front-end client can make requests for resources to an external back-end server.
app.use(cors());

// an open source JavaScript library that helps you secure your Node. js application by setting several HTTP headers
app.use(helmet());

// -------------------------------------------------------------------------------

// Morgan is another HTTP request logger middleware for Node. js. It simplifies the process of logging requests to your application.
app.use(morgan("combined", { stream: accessLogStream }));
app.use(
  morgan("combined", {
    stream: errorLogStream,
    skip: (req, res) => res.statusCode < 400,
  })
);

// -------------------------------------------------------------------------------
// models and
const sequelize = require("./utils/database");
const UserRouter = require("./Routes/UserRoutes");
const ExpenseRouter = require("./Routes/ExpenseRoute");
const PurchaseRouter = require("./Routes/PurchaseRouter");
const PremiumRouter = require("./Routes/PremiumUser");
const ForgetPasswordRouter = require("./Routes/ForgotRoute");
const User = require("./Model/UserModel");
const Expense = require("./Model/ExpenseModel");
const Order = require("./Model/PurchaseModel");
const ForgetPassword = require("./Model/ForgotModel");
const DownloadedFiles = require("./Model/Download");

// -------------------------------------------------------------------------------

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgetPassword);
ForgetPassword.belongsTo(User);

User.hasMany(DownloadedFiles);
DownloadedFiles.belongsTo(User);

// -------------------------------------------------------------------------------

app.use(bodyParser.json({ extended: true }));
app.use("/user", UserRouter);
app.use("/expense", ExpenseRouter);
app.use("/purchase", PurchaseRouter);
app.use("/preminum", PremiumRouter);
app.use("/password", ForgetPasswordRouter);

// -------------------------------------------------------------------------------

sequelize
  .sync()
  .then((res) => {
    app.listen(process.env.PORT || 4000);
  })
  .catch((err) => {
    console.log(err);
  });
