const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Router = require("./router/index.js");
const postRouter = require("./router/postRouter");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", Router);
app.use("/post", postRouter);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected on MongoDB"))
  .catch((err) => console.log(err.message));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT : ${process.env.PORT}`);
});