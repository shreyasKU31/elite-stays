const mongoose = require("mongoose");
const Review = require("./review.js");

const listingScema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  discription: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

//Middleware to delete all the reviews of a listing when the listing is deleted
listingScema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingScema);
module.exports = Listing;
