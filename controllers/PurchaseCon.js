const Razorpay = require("razorpay");
const Order = require("../Model/PurchaseModel");
const token = require("./userCon");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ----------------------------------------------------------------------------------------------

exports.purchasePremium = async (req, res, next) => {
  try {
    let rzp = new Razorpay({
      key_id: process.env.Razorpay_key_id,
      key_secret: process.env.Razorpay_key_secret,
    });
    const amount = 2500;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          res.status(200).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

// ----------------------------------------------------------------------------------------------

const generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign(
    { userId: id, name: name, ispremiumuser },
    'secretkey'
  );
};

// ----------------------------------------------------------------------------------------------

exports.updateStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const name = req.user.name;
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = req.user.update({ ispremiumuser: true });

    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(201).json({
          success: true,
          message: "Transaction Successful",
          token: generateAccessToken(userId, name, true),
        });
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
  } catch (error) {
    console.log("error:", error);
  }
};
