const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
     const allListing = await Listing.find({});
     res.render("listings/index.ejs", { allListing })
};

module.exports.renerNewForm = (req, res) => {
     res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
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
};

module.exports.createNewListing = async (req, res, next) => {
     const newListing = new Listing(req.body.listing);
     console.log(req.user);
     newListing.owner = req.user._id;
     await newListing.save();
     req.flash("success", "New Lisitng Created!");
     res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
     let { id } = req.params;
     const listing = await Listing.findById(id);
     if (!listing) {
          req.flash("error", "Listing does not exist It may have been deleted!");
          res.redirect("/listings")
     }
     res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
     if (!req.body.listing) {
          throw new ExpressError(400, "Send some valid data for listing")
     }
     let { id } = req.params;
     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("success", "Lisitng Updated!");
     res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
     let { id } = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     req.flash("success", "Lisitng Deleted!");
     console.log(deletedListing);
     res.redirect("/listings")
};