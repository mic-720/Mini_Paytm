const express = require("express");
const router = express.Router();
const Account = require("../models/accountModel");
const { authMiddleware } = require("../middleware");
const mongoose = require("mongoose")

router.get("/balance", authMiddleware, async (req, res) => {
  const currUserId = req.userId;
  try {
    const account = await Account.findOne({ userId: currUserId });
    res.status(200).json({
      balance: account.balance,
    });
  } catch (error) {
    res.status(411).json({
      message: "Unable to retrieve balance",
    });
  }
});

/*
 Transaction numbers are only allowed on a replica set member or mongos
 try to fix this error 
 */
// router.post("/balance", authMiddleware, async (req, res) => {
//   let { to, balance } = req.body;
//   const currUserId = req.userId;
//   const session = await mongoose.startSession();

//   session.startTransaction();
//   try {
//     const fromAccount = await Account.findOne({ userId: currUserId }).session(
//       session
//     );
//     if (!fromAccount || fromAccount.balance < balance) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         message: "Account not found or Insufficient balance",
//       });
//     }

//     const toAccount = await Account.findOne({ userId: to }).session(session);
//     if (!toAccount) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         message: "Invalid Receiver Account details",
//       });
//     }

//     await Account.updateOne(
//       { userId: currUserId },
//       { $inc: { balance: -balance } }
//     ).session(session);

//     await Account.updateOne(
//       { userId: to },
//       { $inc: { balance: balance } }
//     ).session(session);

//     await session.commitTransaction();
//     return res.status(200).json({
//       message: "Transaction successful",
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     return res.status(411).json({
//       message: "Transfer failed",
//       error: error.message,
//     });
//   } finally {
//     session.endSession();
//   }
// });

router.post("/balance", authMiddleware, async (req, res) => {
  const { amount, to } = req.body;

  const account = await Account.findOne({
    userId: req.userId,
  });

  if (account.balance < amount) {
    return res.status(411).json({
      message: "Insufficient balance",
    });
  }

  const toAccount = await Account.findOne({
    userId: to,
  });

  if (!toAccount) {
    return res.status(411).json({
      message: "Invalid account",
    });
  }

  await Account.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  );

  await Account.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        balance: amount,
      },
    }
  );

  res.status(200).json({
    message: "Transfer successful",
  });
});

module.exports = router;
