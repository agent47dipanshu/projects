const express = require('express');
const router = express.Router();


//Index users
router.get("/", (req, res) => {
     res.send("hello")
});

//show users
router.get("/:id", (req, res) => {
     res.send("show users")
});

//post route
router.post("/", (req, res) => {
     res.send("post for users")
});

//Delete Route
router.delete("/:id", (req, res) => {
     res.send("delete for users")
});

module.exports = router;