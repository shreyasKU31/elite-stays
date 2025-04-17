const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {
  index,
  showListings,
  renderEdit,
  updateEdit,
  postListings,
  deleteListing,
  renderCreateListing,
} = require("../controllers/listings.js");

// Route to show a form for creating a new listing
router.get("/new", isLoggedIn, renderCreateListing);
router.post("/", validateListing, wrapAsync(postListings));

//Route to get all the listings data from DB
router.get("/", wrapAsync(index));

//Route to show a listing in detail
router.get("/:id", wrapAsync(showListings));

//Edit form route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEdit));
//Udate Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(updateEdit));

//Delete Listing route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteListing));

module.exports = router;
