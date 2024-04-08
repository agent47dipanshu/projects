const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")




//Index Route
router.get("/", wrapAsync(async (req, res) => {
     const allListing = await Listing.find({});
     res.render("listings/index.ejs", { allListing })
}));

//New Route
router.get("/new", isLoggedIn, (req, res) => {
     res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
     let { id } = req.params;
     const listing = await Listing.findById(id)
          .populate({
               path: "reviews",
               populate: {
                    path: "author"
               },
          })
          .populate("owner");
     if (!listing) {
          req.flash("error", "Listing does not exist It may have been deleted!");
          res.redirect("/listings");
     };
     console.log(listing);
     res.render("listings/show.ejs", { listing });
}));


//Create Route
router.post("/", validateListing, isLoggedIn, wrapAsync(async (req, res, next) => {
     const newListing = new Listing(req.body.listing);
     console.log(req.user);
     newListing.owner = req.user._id;
     await newListing.save();
     req.flash("success", "New Lisitng Created!");
     res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
     let { id } = req.params;
     const listing = await Listing.findById(id);
     if (!listing) {
          req.flash("error", "Listing does not exist It may have been deleted!");
          res.redirect("/listings")
     }
     res.render("listings/edit.ejs", { listing });
}));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
     if (!req.body.listing) {
          throw new ExpressError(400, "Send some valid data for listing")
     }
     let { id } = req.params;
     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("success", "Lisitng Updated!");
     res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
     let { id } = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     req.flash("success", "Lisitng Deleted!");
     console.log(deletedListing);
     res.redirect("/listings")
}));

module.exports = router;