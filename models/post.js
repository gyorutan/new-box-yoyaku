const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    writer: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time1: {
      type: String,
      required: true,
    },
    time2: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
