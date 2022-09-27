const router = require("express").Router();

router.get("/userTest", (req, res) =>{
    res.send("user test is successful!!!");
});


router.post("/userTest", (req, res) =>{
    const userName = req.body.userName;
    res.send("user test post is successful!!!");
});
module.exports = router;