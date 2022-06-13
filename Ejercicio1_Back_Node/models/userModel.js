const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: false,
      trim: true,
      maxlength: 25,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },
    username: {
      type: String,
      required: false,
      trim: true,
      maxlength: 25,
      // unique: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
      // default: "https://res.cloudinary.com/linda-leblanc/image/upload/v1634579968/test/sg8cthiiicwehkmnynsm.png"
    },
    mobile: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
    strict: false
  },
);

module.exports = mongoose.model("user", UserSchema);