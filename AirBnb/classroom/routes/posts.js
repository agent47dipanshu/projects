const express = require('express');
const router = express.Router();


router.get("/", (req, res) => {
     res.send("hello")
});

//show posts
router.get("/:id", (req, res) => {
     res.send("show posts");
});

//post route
router.post("/", (req, res) => {
     res.send("post for posts")
});

//Delete Route
router.delete("/:id", (req, res) => {
     res.send("delete for posts")
});

module.exports = router;