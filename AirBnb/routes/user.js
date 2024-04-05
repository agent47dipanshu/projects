const express = require('express');
const User = require('../models/user');
const wrapasync = require('../utils/wrapasync');
const passport = require('passport');
const router = express.Router();

router.get("/signup", (req, res) => {
     res.render('../views/users/signup.ejs');
});

router.post("/signup", wrapasync(async (req, res) => {
     try {
          let { username, email, password } = req.body;
          const newUser = new User({ email, username });
          const registeredUser = await User.register(newUser, password);
          console.log(registeredUser);
          req.flash("success", `Hello ${username}`);
          res.redirect("/listings");
     }
     catch (e) {
          req.flash("error", e.message);
          res.redirect("/signup");
     }
}));

router.get("/login", (req, res) => {
     res.render("../views/users/login.ejs")
});

router.post("/login", passport.authenticate('local', { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
     req.flash("success", "Welcome");
     res.redirect("/listings");
});

router.get("/logout", (req, res, next) => {
     req.logOut((err) => {
          if (err) {
               return next(err);
          }
          else {
               req.flash("success", "You are logged out now");
               res.redirect("/listings");
          };
     });
})

module.exports = router; 