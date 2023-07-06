const Expense = require("../Model/ExpenseModel");
const User = require("../Model/UserModel");
const sequelize = require("../utils/database");
const DownloadedFiles = require("../Model/Download");
require("dotenv").config();
const Aws = require("aws-sdk");

// -------------------------------------------------------------

const addExpense = async (req, res, next) => {
  let amount = req.body.amount;
  let description = req.body.description;
  let category = req.body.category;

  try {
    const data = await Expense.create({
      amount,
      description,
      category,
      userId: req.user.id,
    }).then((expense) => {
      const totalExpenses = Number(req.user.totalExpenses) + Number(amount);
      User.update(
        { totalExpenses: totalExpenses },
        { where: { id: req.user.id } }
      );
    });
    res.status(200).json({ expense: data, success: true });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ success: false, error: error });
  }
};

// ---------------------------------------------------------------------------------

// const getExpense = async (req, res, next) => {
//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 5;

//   try {
//     let data = await Expense.findAll({ where: { userId: req.user.id } });
//     const NewData = await Expense.findAll({
//       offset: (page - 1) * limit,
//       limit: limit,
//     });
//     return res.status(200).json({
//       NewData,
//       currentPage: page,
//       nextPage: page + 1,
//       previouspage: page - 1,
//       lastpage: Math.ceil(data.length / limit),
//     });
//   } catch (error) {
//     console.log("error:", error);
//     res.status(500).json({ success: false, error: error });
//   }
// };


const getExpense = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  try {
    const totalCount = await Expense.count({ where: { userId: req.user.id } });
    const totalPages = Math.ceil(totalCount / limit);

    const NewData = await Expense.findAll({
      where: { userId: req.user.id },
      offset: (page - 1) * limit,
      limit: limit,
    });

    return res.status(200).json({
      NewData,
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ success: false, error: error });
  }
};
// ----------------------------------------------------------------------

const deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const user = await Expense.findOne({ where: { id: id } });
    const response = await Expense.destroy({
      where: { id: id },
      transaction: t,
    });

    const totalExpenses = Number(req.user.totalExpenses) - Number(user.amount);
    await req.user.update({ totalExpenses: totalExpenses }, { transaction: t });
    if (response === 0) {
      return res.status(401).json({
        message: "Expense does not Belongs to User",
        success: false,
      });
    }
    await t.commit();
    res
      .status(200)
      .json({ message: response, success: true, totalExpense: totalExpenses });
  } catch (error) {
    console.log("error:", error);
  }
};

// ------------------------------------------------------------------------

function uploadToS3(data, filename) {
 

  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  // AKIAXEXUGGGVSE52NBGZ

  let s3bucket = new Aws.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });
  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("SOMETHING WENT WRONG", err);
        reject(err);
      } else {
        resolve(s3response.Location);
      }
    });
  });
}

// ----------------------------------------------------------------------

const downloadExpense = async (req, res, next) => {
  try {
    const ex = await Expense.findAll({ where: { userId: req.user.id } });
    const good = JSON.stringify(ex);
    const userId = req.user.id;
    const fileName = `Expense${userId}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(good, fileName);
    console.log(fileName, fileUrl);
    let data = await DownloadedFiles.create({
      url: fileUrl,
      userId: req.user.id,
    });

    res.status(200).json({ data: data, success: true });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ success: false });
  }
};

module.exports = {
  addExpense,
  getExpense,
  deleteExpense,
  downloadExpense,
};
