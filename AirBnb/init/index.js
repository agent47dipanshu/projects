const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = 'mongodb://127.0.0.1:27017/project'


main()
     .then(() => {
          console.log("Connected TO DB");
     }).catch(err => {
          console.log(err);
     });
async function main() {
     await mongoose.connect(MONGO_URL);
};


const initDb = async () => {
     await Listing.deleteMany({});
     initData.data = initData.data.map((obj) => (
          ({ ...obj, owner: '66100f19377379515384e23d' })
     ));
     await Listing.insertMany(initData.data);
     console.log("Data was initialized")
};

initDb();