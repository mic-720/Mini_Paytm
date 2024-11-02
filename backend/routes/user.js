require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  userSignupSchema,
  userEditSchema,
  userSigninSchema,
} = require("../validations/user");

const User = require("../models/userModel");
const Account = require("../models/accountModel");
var jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");

router.post("/signup", async (req, res) => {
  try {
    if (!userSignupSchema.safeParse(req.body).success) {
      return res.status(411).json({
        message: "Input validation failed",
      });
    }
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(411).json({
        msg: "Username already taken",
      });
    }
    const newUser = User(req.body);
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS, 10));
    const hash = await bcrypt.hash(password, salt);
    newUser.password = hash;
    await newUser.save();

    const account = Account({
      userId: newUser._id,
      balance: Math.random() * 10000 + 1,
    });
    await account.save();

    let token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
    res.status(200).json({
      token: token,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(411).json({
      message: "Error while Singup",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    if (!userSigninSchema.safeParse(req.body).success) {
      return res.status(411).json({
        message: "Input validation failed",
      });
    }
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    const passCheck = await bcrypt.compare(password, user.password);
    if (!user || !passCheck) {
      return res.status(411).json({
        message: "User not found/Invalid credentials",
      });
    }
    let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      message: "user signin successfull",
      token: token,
    });
  } catch (error) {
    res.status(411).json({
      message: "Error while Signin",
    });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  if (!userEditSchema.safeParse(req.body).success) {
    return res.json(411).json({
      message: "Input Validation Failed",
    });
  }
  try {
    const { password, ...updateFields } = req.body;
    let currentUserId = req.userId;

    if (password) {
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS, 10));
      updateFields.password = await bcrypt.hash(password, salt);
    }
    await User.findByIdAndUpdate(currentUserId, updateFields, { new: true });
    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(411).json({
      message: "Error while updating user information",
    });
  }
});

router.get("/bulk", authMiddleware, async (req, res) => {
  let { filter } = req.query;

  const users = await User.find({
    _id: { $ne: req.userId }, // Exclude the current user
    $or: [
      { firstname: { $regex: filter, $options: "i" } },
      { lastname: { $regex: filter, $options: "i" } },
    ],
  });

  const formattedUsers = users.map((user) => ({
    firstname: user.firstname,
    lastname: user.lastname,
    _id: user._id,
  }));

  res.status(200).json({
    users: formattedUsers,
  });
});


router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.userId;
    const account = await Account.findOne({ userId: currentUserId });
    const user = await User.findById(currentUserId);
    if (user) {
      res.status(200).json({
        username: user.username,
        balance: account.balance,
      });
    } else {
      res.status(411).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user data" });
  }
});

router.post("/logout",authMiddleware,(req,res)=>{
  res.status(200).json({
    message: "Logoutu successful"
  })
})

module.exports = router;
