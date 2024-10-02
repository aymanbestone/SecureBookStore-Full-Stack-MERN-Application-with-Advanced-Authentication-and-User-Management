const express = require("express");
const { User, validateUpdate } = require("../models/User");
const router = express.Router();
const asynchandler = require("express-async-handler");
const { route } = require("./book");
const bcryptjs = require("bcryptjs");
router.use(express.json());
const { verifyToken ,verifyTokenAndautorize , verifyTokenAndadmin} = require("../middlwares/verifyToken");

/**
 * @desc get all users
 * @method get
 * @access private (only admin)
 * @route /
 */
router.get(
  "/",verifyTokenAndadmin ,
  asynchandler(async (req, res) => {
   const users= await User.find().select("-password")
   res.status(200).json(users)
  })
);

/**
 * @desc get user by id
 * @method get
 * @access private (only user or admin)
 * @route /id
 */
router.get(
  "/:id",verifyTokenAndautorize, 
   asynchandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json({
        message: `l'utilisateur ${user.username} est la et ses information au dessous !! `,
        user,
      });
    } else {
      res.status(404).json({ message: "ce utilisateur n'est pas trouve " });
    }
  })
);
/**
 * @desc UPDATE USER
 * @method put
 * @access private
 * @route /id
 */
router.put("/:id", verifyTokenAndautorize , asynchandler(async (req, res) => {
   
    const { error } = validateUpdate(req.body);
    if (error) {
      res.status(400).json({ messsage: error.details[0].message });
    }

    //hasher le password si il est envoye
    if (req.body.password) {
      const salt = await bcryptjs.genSalt(10);
      req.body.password = await bcryptjs.hash(req.body.password, salt);
    }
    console.log(req.headers);
    const boo = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    ).select("-password");

    res.status(201).json({ message: "update avec suceess!!", boo });
  })
);
/**
 * @desc delete
 * @method get
 * @access private (only user or admin)
 * @route /id
 */
router.delete(
  "/:id",verifyTokenAndautorize, 
   asynchandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id).select("-password");
    if (user) {
      res.json({
        message: `l'utilisateur ${user.username} est suprimer !! `,
        user,
      });
    } else {
      res.status(404).json({ message: "ce utilisateur n'est pas trouve " });
    }
  })
);

module.exports = router;
