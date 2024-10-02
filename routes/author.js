const express = require("express");
const router = express.Router();
const asynchandler =require("express-async-handler")
const {Author,validateCreateAuthor,validateUpdateAuthor} = require("../models/Author");
const {verifyTokenAndadmin}=require("../middlwares/verifyToken")
/**
 * @desc get all authors
 * @route /authors
 * @method get
 * @access public
 */
router.get("/",  async (req, res) => {
  try {
    const auts = await Author.find();

    res.status(200).json(auts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something wrong" });
  }
});
/**
 * @desc search  author width his id
 * @route /authors/:id
 * @method get
 * @access public
 */

router.get("/:id", asynchandler( async (req, res) => {
  
    const aut = await Author.findById(req.params.id);
    res
      .status(200)
      .json({ message: `L'auteur ${aut.name} est disponible`, aut });
  
}
));
/**
 * @desc create new author
 * @route /authors/
 * @method post
 * @access private (only admin)
 */
router.post("/", verifyTokenAndadmin, async (req, res) => {
  const { error } = validateCreateAuthor(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const author = new Author({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      nationality: req.body.nationality,
    });

    const result = await author.save();

    res.status(201).json({
      message: `il est  insrit l'auteur ${author.firstname} ${author.lastname}`,
      result,
    });
  } catch (error) {
    res.status(500).json({ ereure: error.message });
  }
});
/**
 * @desc update auhor
 * @route /authors/:id
 * @method put
 * @access private (only admin)
 */
router.put("/:id", verifyTokenAndadmin, async (req, res) => {
  const { error } = validateUpdateAuthor(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const aut = await Author.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
         firstname:req.body.firstname,
         lastname:req.body.lastname,
         nationality:req.body.nationality
        },
      },
      { new: true }
    ); //pour new true si on veux qu'il nous retourne l'objet qui est updater
    res.status(201).json({ message: "update avec suceess!!", aut });
  } catch (eror) {
    res.status(500).json({ message: eror.message });
  }
});
/**
 * @desc DELETE BOOK WIDTH ID
 * @route  /book
 * @methode delete
 * @access private (only admin)
 */
router.delete("/:id",verifyTokenAndadmin, async (req, res) => {
  try {
    const aut = await Author.findById(req.params.id);
    if (aut) {
      const aut = await Author.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: `delete avec succes de ${aut.name}!!` });
    } else {
      res.status(400).json({ message: "aucun autheur avec ce id " });
    }
  } catch (eror) {
    res.status(500).json({ message: eror.message });
  }
});

module.exports = router;
