const express = require('express');
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/posts.js");
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptons = { secret: "secretString", resave: false, saveUninitialized: true }

app.use(session(sessionOptons));

app.use((req, res, next) => {
     res.locals.successMsg = req.flash("success");
     res.locals.errorMsg = req.flash("error");
     next()
})

// app.use(session(sessionOptons));
app.use(flash());

app.get("/register", (req, res) => {
     let { name = "Dipanshu" } = req.query;
     req.session.name = name;
     if (name === "Dipanshu") {
          req.flash("error", "user not registered")
     } else {
          req.flash('success', 'User registered');
     }
     res.redirect("/hello")
})

app.get("/hello", (req, res) => {
     res.locals.successMsg = req.flash("success");
     res.locals.errorMsg = req.flash("error");
     res.render('page.ejs', { name: req.session.name });
});

// app.get("/reqcount", (req, res) => {
//      if (req.session.count) {
//           req.session.count++;
//      }
//      else {
//           req.session.count = 1;
//      };
//      res.send(`You sent a request ${req.session.count} times`);
// });
app.listen(3000, () => {
     console.log("Server is running on 3000");
});