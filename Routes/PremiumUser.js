const express = require("express");
const authenticate = require("../Middleware/auth");
const { getUserLeaderBoard } = require("../controllers/PremiumUser");
const router = express.Router();

router.get("/showLeaderBoard", authenticate, getUserLeaderBoard);

module.exports = router;
