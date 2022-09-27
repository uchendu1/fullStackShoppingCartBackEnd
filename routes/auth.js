const router = require("express").Router();
const CryptoJs = require("crypto-js");// auth for register
const jwt = require("jsonwebtoken"); // auth for login
const User = require("../models/User");


//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("wrong credentials!");
    const hashedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET
    );

    const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
    OriginalPassword !== req.body.password &&
      res.status(401).json("wrong credentials!");

      const accessToken = jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {expiresIn: "3d"}
      );


    const { password, ...others } = user._doc;
    res.status(200).json({...others, accessToken});
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
