const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../controllers/listing.js");
const wrapasync = require('../utils/wrapasync.js');

const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });



//Index Route
router.route("/")
     .get(wrapAsync(listingController.index))
     .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapasync(listingController.createNewListing))


//New Route
router.get("/new", isLoggedIn, listingController.renerNewForm);

//Show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createNewListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));


module.exports = router;