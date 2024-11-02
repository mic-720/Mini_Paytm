const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const accountSchema = mongoose.Schema({
  balance: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;
