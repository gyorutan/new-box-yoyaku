const bcrypt = require("bcrypt");
const Post = require("../models/post");

const createPost = async (req, res) => {
  try {
    const writer = req.body.scheduleData.writer;
    const password = req.body.scheduleData.password;
    const time = req.body.scheduleData.time;
    const date = new Date(req.body.value);

    if (!time) {
      return res
        .status(400)
        .json({ success: "time", message: "時間を指定してください" });
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const dayOfWeek = new Date(year, month - 1, day).getDay();
    const daysOfWeekInJapanese = ["日", "月", "火", "水", "木", "金", "土"];

    const newDate = `${year}年${month}月${day}日(${daysOfWeekInJapanese[dayOfWeek]})`;

    const hashedPassword = await bcrypt.hash(password, 12);

    const newPost = await Post.create({
      writer,
      password: hashedPassword,
      date: newDate,
      time,
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
  const posts = await Post.find().sort({ time: 1 });

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

const checkingPosts = async (req, res) => {
  try {
    const date = new Date(req.body.e);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
    const day = date.getDate();

    const dayOfWeek = new Date(year, month - 1, day).getDay();
    const daysOfWeekInJapanese = ["日", "月", "火", "水", "木", "金", "土"];

    const newDate = `${year}年${month}月${day}日(${daysOfWeekInJapanese[dayOfWeek]})`;

    const checkedDate = await Post.find({ date: newDate }).exec();

    const reservedTimes = {
      time: [],
    };

    checkedDate.forEach((item) => {
      reservedTimes.time.push(item.time);
    });

    return res.status(200).json({
      message: "예약된 시간",
      reservedTimes,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createPost, getAllPosts, deletePost, checkingPosts };
