const mongoose = require("mongoose");

const reviewScema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = new mongoose.model("Review", reviewScema);
