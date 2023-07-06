const Expense = require("../Model/ExpenseModel");
const User = require("../Model/UserModel");
const sequelize = require("../utils/database");

exports.getUserLeaderBoard = async (req, res, next) => {
  try {
    const leaderBoardOfUsers = await User.findAll({
      order: [["totalExpenses", "DESC"]],
    });
    res.status(200).json(leaderBoardOfUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
