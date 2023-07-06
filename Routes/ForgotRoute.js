const express = require("express");
const {
  forgetPassword,
  resetPassword,
  updatepassword,
} = require("../controllers/ForgotCon");
const router = express.Router();
router.post("/forgotpassword", forgetPassword);
router.get("/resetpassword/:id", resetPassword);
router.get("/updatepassword/:id", updatepassword);
module.exports = router;
