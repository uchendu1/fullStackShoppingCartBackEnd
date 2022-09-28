const router = require("express").Router();
const CryptoJs = require("crypto-js"); // auth for register
const User = require("../models/User");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //check if the user changed its password:
  if (req.body.password) {
    req.body.password = CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(err);
  }
});

//delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("user has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
});

//get  one user
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new
  try {
    const users = query ?  await User.find().sort({_id: -1}).limits(5) : User.find(1);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
