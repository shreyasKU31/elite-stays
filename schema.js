const joi = require("joi");

const listingSchema = joi.object({
  title: joi.string().required(),
  discription: joi.string().required(),
  image: joi.string().allow("", null),
  price: joi.number().required().min(0),
  location: joi.string().required(),
  country: joi.string().required(),
});

const reviewSchema = joi.object({
  rating: joi.number().min(1).max(5).required(),
  comment: joi.string().required(),
});
module.exports = { listingSchema, reviewSchema };
