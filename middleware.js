const Listing = require("./models/listing");
const Review = require("./models/review.js"); 
const ExpressError = require("./utils/ExpressError.js");
//for SERVER SIDE VALIDATION of listing--------------------------------STEP(2)
const {listingSchema, reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You need to login before making a change!");
        return res.redirect("/login");
    }
    next();
};

module.exports.savedRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner= async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You aren't the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//for SERVER SIDE VALIDATION of listing (middleware)--------------------------------STEP(3)
module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");           //additional details in error separated by comma
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");           //additional details in error separated by comma
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};

module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You aren't the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};