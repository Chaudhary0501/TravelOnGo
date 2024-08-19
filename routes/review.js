const express = require("express");
const router = express.Router({mergeParams: true});                //to merge parent id from app.js to child (review)
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js"); 
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//REVIEWS------------------------------------------
//Post Route for REVIEW
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Route for REVIEW
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;