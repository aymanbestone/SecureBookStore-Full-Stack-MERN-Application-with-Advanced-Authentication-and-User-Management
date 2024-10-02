const express = require("express");
const router = express.Router();
router.use(express.json());
const {verifyTokenAndadmin}=require("../middlwares/verifyToken")
const asynchandler = require("express-async-handler");
const {
  Book,
  validateCreateAuthor,
  validateUpdateAuthor,
} = require("../models/Book");
/**
 * @desc get all authors
 * @route /
 * @method get
 * @access public
 */
router.get(
  "/",
  asynchandler(async (req, res) => {
    const books = await Book.find().populate("author",["name","age","-_id"]);
    res.status(200).json(books);
  })
);
/**
 * @desc get book by id 
 * @route /:id
 * @method get
 * @access public
 */
router.get(
  "/:id",
  asynchandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("author",["name","age","-_id"]);
    /* POUR AFFICHER LES INFORMATION DE L'AUTHOR AU LIEU DE SON OBJECT ID ON FAIT POPULATE 
    EN PLUS AU PREMIER ARGUMENT LE NOM DE champ de notre collection sans le "s" car c juste un cham
    et au dexieme argume si on veux afficher juste des information specifique
    */
    if (book) {
      res.status(200).json({ message: "book disponible", book });
    } else {
      res.status(404).json({ message: "book n'est disponible" });
    }
  })
);
/**
 * @desc create new book
 * @route /
 * @method post
 * @access private (only admin)
 */
router.post(
  "/",verifyTokenAndadmin,
  asynchandler(async (req, res) => {
    const { error } = validateCreateAuthor(req.body);
    if (error) {
      res.status(400).json({ messsage: error.details[0].message });
    }

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover,
    });

    const result = await book.save();
    res.status(201).json({ message: "book est bien ajoute !!", result });
  })
);
/**
 * @desc update user 
 * @route /:id
 * @method put
 * @access private (only admin)
 */
router.put(
  "/:id",verifyTokenAndadmin,
  asynchandler(async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
      res.status(400).json({ messsage: error.details[0].message });
    }
    const boo = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          price: req.body.price,
          cover: req.body.cover,
        },
      },
      { new: true }
    );

    res.status(201).json({ message: "update avec suceess!!", boo });
  })
);
/**
 * @desc delete book by id 
 * @route /:
 * @method delete
 * @access private (only admin)
 */
router.delete(
  "/:id",verifyTokenAndadmin,
  asynchandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if(book)
    {const boo = await Book.findByIdAndDelete(req.params.id);
      res.status(201).json({ message: "delete avec suceess!!", boo });
    }
    else {
      res.status(404).json({ message: "not found "});
    }

    
  })
);

module.exports = router;
