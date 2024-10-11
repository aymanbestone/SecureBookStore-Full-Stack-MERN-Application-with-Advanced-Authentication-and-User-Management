const asynchandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const {
    User,
    validateCreate,
    validateLogin,
    validateUpdate,
  } = require("../models/User");
/**
 * @desc create user
 * @method post
 * @access public
 * @route /
 */
const registerUser = asynchandler(async (req, res) => {
  const { error } = validateCreate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const utilisateur = await User.findOne({ email: req.body.email });

  if (utilisateur) {
    return res.status(400).json({ message: "ce utilisateur est deja creer" });
  }
  //crypter le password
  const salt = await bcryptjs.genSalt(10);
  req.body.password = await bcryptjs.hash(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  const result = await user.save();
  const token = user.generateToken(); // on l'appele avec l'instance
  const { password, ...other } = result._doc;
  res.status(200).json({ other, token });
});
/**
 * @desc login user
 * @method post
 * @access public
 * @route /
 */
const loginUser = asynchandler(async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res
      .status(400)
      .json({ message: "aucun utilisateur enregistre avec ces information" });
  }

  const ispasswordtrue = await bcryptjs.compare(
    req.body.password,
    user.password
  );

  // json web token
  const token = user.generateToken();
  if (ispasswordtrue) {
    res.status(200).json({ message: "connexion avec succes !!", token });
  } else {
    res.status(400).json({ message: "email ou password invalide !!" });
  }
});

module.exports = {
  registerUser,
  loginUser,
};
