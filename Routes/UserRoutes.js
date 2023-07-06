const express = require("express");
const { signup, login } = require("../controllers/userCon");

const router = express.Router();

router.post("/sign", signup);
router.post("/login", login);
module.exports = router;
