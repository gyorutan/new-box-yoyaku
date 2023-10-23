const mongoose = require("mongoose");

const timeSchema = mongoose.Schema({
  Stime: {
    type: Array,
  },
  Htime: {
    type: Array,
  },
});

const Time = mongoose.model("Time", timeSchema);
module.exports = Time;
