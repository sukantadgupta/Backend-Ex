const express = require("express");
const authenticate = require("../Middleware/auth");
const { purchasePremium, updateStatus } = require("../controllers/PurchaseCon");
const Router = express.Router();

Router.get("/premiummembership", authenticate, purchasePremium);
Router.post("/updatetransactionstatus", authenticate, updateStatus);

module.exports = Router;
