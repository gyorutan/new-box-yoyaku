const bcrypt = require("bcrypt");
const Post = require("../models/post");
const moment = require("moment-timezone");

const createPost = async (req, res) => {
  try {
    const writer = req.body.scheduleData.writer;
    const password = req.body.scheduleData.password;
    const time = req.body.scheduleData.time;

    if (!time) {
      return res
        .status(400)
        .json({ success: "time", message: "時間を指定してください" });
    }

    const date = new Date(req.body.value);

    console.log("저장함수 Date", date);

    const jpDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    console.log("저장함수 jpDate", jpDate);

    const year = jpDate.getFullYear();
    const month = jpDate.getMonth() + 1;
    const day = jpDate.getDate();

    console.log("저장함수 year", year);
    console.log("저장함수 month", month);
    console.log("저장함수 day", day);
    console.log("저장함수 day - 1", day - 1);

    const dayOfWeek = new Date(year, month - 1, day - 1).getDay();

    console.log("저장함수 dayOfWeek", dayOfWeek);

    const daysOfWeekInJapanese = ["日", "月", "火", "水", "木", "金", "土"];

    const newDate = `${year}年${month}月${day - 1}日(${
      daysOfWeekInJapanese[dayOfWeek]
    })`;

    console.log("저장함수 newDate", newDate);

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

    console.log("저장함수 Date", date);

    const jpDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    console.log("저장함수 jpDate", jpDate);

    const year = jpDate.getFullYear();
    const month = jpDate.getMonth() + 1;
    const day = jpDate.getDate();

    console.log("저장함수 year", year);
    console.log("저장함수 month", month);
    console.log("저장함수 day", day);
    console.log("저장함수 day - 1", day - 1);

    const dayOfWeek = new Date(year, month - 1, day - 1).getDay();

    console.log("저장함수 dayOfWeek", dayOfWeek);

    const daysOfWeekInJapanese = ["日", "月", "火", "水", "木", "金", "土"];

    const newDate = `${year}年${month}月${day - 1}日(${
      daysOfWeekInJapanese[dayOfWeek]
    })`;

    console.log("저장함수 newDate", newDate);

    const checkedDate = await Post.find({ date: newDate }).exec();

    const reservedTimes = {
      time: [],
    };

    checkedDate.forEach((item) => {
      reservedTimes.time.push(item.time);
    });

    console.log("예약된 시간", reservedTimes);

    return res.status(200).json({
      message: "예약된 시간",
      reservedTimes,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createPost, getAllPosts, deletePost, checkingPosts };
