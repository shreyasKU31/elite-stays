const Listing = require("../models/listing.js");
const mbxClient = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxClient({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  await Listing.find().then((r) => {
    let listings = r;
    res.render("listings.ejs", { listings });
  });
};

module.exports.renderCreateListing = (req, res) => {
  res.render("createList.ejs");
};

module.exports.postListings = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
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
  listing.image = { url, filename };
  let responce = await geocodingClient
    .forwardGeocode({
      query: listing.location,
      limit: 1,
    })
    .send();
  listing.geometry = responce.body.features[0].geometry; //.features[0].geometry;

  await listing.save();
  req.flash("success", "Listing Created Sucessfully");
  res.redirect("/listings");
};

module.exports.showListings = async (req, res) => {
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
};

module.exports.renderEdit = async (req, res) => {
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
      let originalImageUrl = editList.image.url;
      originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
      res.render("edit.ejs", { editList, originalImageUrl });
    })
    .catch((err) => console.log(err));
};

module.exports.updateEdit = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, req.body);

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated Sucessfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing is Deleted");
  res.redirect("/listings");
};
