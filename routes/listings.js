const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const { listingSchema } = require("../schema.js");

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

// Route to show a form for creating a new listing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("createList.ejs");
});
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
      throw new ExpressError(400, result.error);
    }

    const { title, discription, image, price, location, country } = req.body;
    let listing = new Listing({
      title,
      discription,
      image,
      price,
      location,
      country,
    });
    req.flash("success", "Listing Created Sucessfully");
    await listing.save();
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
    const list = await Listing.findById(id).populate("reviews");
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
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body) {
      throw new ExpressError(
        400,
        "Ivalid form data. Please fill all the fields."
      );
    }
    let { id } = req.params;
    // console.log(req.body);
    const list = await Listing.findByIdAndUpdate(id, req.body);
    req.flash("success", "Listing Updated Sucessfully");

    res.redirect(`/listings/${id}`);
  })
);

//Delete Listing route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
