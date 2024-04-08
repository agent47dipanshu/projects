const express = require('express');
const router = express.Router();
const wrapasync = require('../utils/wrapasync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const { signUp, renderLogIn, logIn, logOut } = require('../controllers/users.js');

router.get("/signup", (req, res) => {
     res.render('../views/users/signup.ejs');
});

router.post("/signup", saveRedirectUrl, wrapasync(signUp));

router.get("/login", renderLogIn);

router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: "/login", failureFlash: true }), logIn);

router.get("/logout", logOut)

module.exports = router; 