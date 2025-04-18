const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const { addReview, deleteReview } = require("../controllers/reviews.js");

//Add review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(addReview));

//Delete Review Route
router.delete(
  "/:reviewId",
  isReviewAuthor,
  isLoggedIn,
  wrapAsync(deleteReview)
);
module.exports = router;
