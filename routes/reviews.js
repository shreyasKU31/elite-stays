const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

//Add review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body);
    newReview.author = req.user._id;
    // let reviewDetails = await newReview.populate("author");
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success", "Review Created Sucessfully");
    res.redirect(`/listings/${req.params.id}`);
  })
);

//Delete Review Route
router.delete(
  "/:reviewId",
  isReviewAuthor,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
  })
);
module.exports = router;
