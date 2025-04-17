const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// Route to show a form for creating a new listing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("createList.ejs");
});
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const { title, discription, image, price, location, country } = req.body;
    let listing = new Listing({
      title,
      discription,
      image,
      price,
      location,
      country,
    });
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "Listing Created Sucessfully");
    res.redirect("/listings");
  })
);

//Route to get all the listings data from DB
router.get(
  "/",
  wrapAsync(async (req, res) => {
    await Listing.find().then((r) => {
      let listings = r;
      res.render("listings.ejs", { listings });
    });
  })
);

//Route to show a listing in detail
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!list) {
      req.flash("error", "Listing you requested does not exist.");
      res.redirect("/listings");
    }
    res.render("list.ejs", { list });
  })
);

//Edit form route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findById(id)
      .then((r) => {
        let editList = r;
        if (!editList) {
          req.flash(
            "error",
            "Listing you requested does not exist and can not be edited."
          );
          res.redirect("/listings");
        }
        res.render("edit.ejs", { editList });
      })
      .catch((err) => console.log(err));
  })
);
//Udate Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body);
    req.flash("success", "Listing Updated Sucessfully");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Listing route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
