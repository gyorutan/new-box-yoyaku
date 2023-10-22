const bcrypt = require("bcrypt");
const Post = require("../models/post");

const createPost = async (req, res) => {
  try {

    const writer = req.body.data.writer;
    const password = req.body.data.password;
    const { date, time1, time2 } = req.body.selectData;

    const post = await Post.findOne({ date, time1, time2 });

    if (post) {
      return res
        .status(400)
        .json({ success: false, message: "既に予約されている時間帯です" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newPost = await Post.create({
      writer,
      password: hashedPassword,
      date,
      time1,
      time2,
    });

    return res
      .status(200)
      .json({ success: true, newPost, message: "予約完了" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "サーバーエラー" });
  }
};

const getAllPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });

  return res.status(200).json(posts);
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const post = await Post.findById(id);

    const comparePassword = await bcrypt.compare(password, post.password);

    if (!comparePassword) {
      return res
        .status(400)
        .json({ success: false, message: "パスワードが一致しません" });
    }

    await Post.findByIdAndRemove(id);

    return res.status(200).json({ success: true, message: "削除完了" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
};

module.exports = { createPost, getAllPosts, deletePost };
