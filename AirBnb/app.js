const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const ExpressError = require("./utils/ExpressError.js");
const MONGO_URL = 'mongodb://127.0.0.1:27017/project';
const session = require('express-session');
const flash = require('connect-flash');
app = express();

const reviews = require('./routes/review.js');
const listings = require("./routes/listing.js");

app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionOptions = {
     secret: "secretString",
     resave: false,
     saveUninitialized: true,
     cookie: {
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true
     }
}

app.use(session(sessionOptions));
app.use(flash());

app.use("/", (req, res, next)=>{
     res.locals.success = req.flash("success");
     next();
});

app.get("/", (req, res) => {
     res.send("working");
});

main()
     .then(() => {
          console.log("Connected TO DB");
     }).catch(err => {
          console.log(err);
     });
async function main() {
     await mongoose.connect(MONGO_URL);
};

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);



// app.get("/test", async (req, res) => {
//      let sampleListing = new Listing({
//           title: "Ghar Ghar",
//           description: "Ghar me raho maze lo",
//           price: 7000000,
//           location: " Ghar me ",
//           country: "Uganda"
//      });
//      await sampleListing.save();
//      console.log("Sample was saved");
//      res.send("Done");
// });

app.all("*", (req, res, next) => {
     next(new ExpressError(404, "Page not found!"))
});

app.use((err, req, res, next) => {
     let { statusCode = 500, message = "Something Went Wrong" } = err;
     res.status(statusCode).render("listings/error.ejs", { err })
     // res.status(statusCode).send(message);
});

app.listen(8080, () => console.log(`App is running on port 8080`));