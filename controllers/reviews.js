const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.addReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body);
  newReview.author = req.user._id;
  await newReview.save();
  listing.reviews.push(newReview);
  await listing.save();
  req.flash("success", "Review Created Sucessfully");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
