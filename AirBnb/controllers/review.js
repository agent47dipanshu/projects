const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
     console.log(req.params.id);
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);
     newReview.author = req.user._id
     listing.reviews.push(newReview);
     console.log(newReview);
     await newReview.save();
     await listing.save();

     req.flash("success", "New Review Added!");
     res.redirect(`/listings/${listing._id}`)
};

module.exports.deleteReview = async (req, res) => {
     let { id, reviewId } = req.params;
     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
     await Review.findOneAndDelete(reviewId);
     req.flash("success", "Review Deleted!");
     res.redirect(`/listings/${id}`);
};