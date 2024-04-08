const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const { validateReview, isLoggedIn, isReviewAutor } = require("../middleware.js");
const { createReview, deleteReview } = require('../controllers/review.js');




//Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

//Delete Route for reviews
router.delete("/:reviewId", isLoggedIn, isReviewAutor, wrapAsync(deleteReview));

module.exports = router;