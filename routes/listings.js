require("dotenv").config();

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
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
const { storage } = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });

// Route to show a form for creating a new listing
router.get("/new", isLoggedIn, renderCreateListing);
router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(postListings)
  );

//Route to get all the listings data from DB
router
  .route("/:id")
  .get(wrapAsync(showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(updateEdit)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEdit));

module.exports = router;
