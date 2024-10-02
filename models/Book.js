    const joi = require("joi");
    const mongoose = require("mongoose");

    const shemaBook = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, minlength: 3 },
        author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author",//REFERENCE AU NOM DE MODELE
        },
        description: { type: String, required: true, trim: true },
        price: {
        type: Number,
        required: true,
        min: 0,
        },
        cover: {
        type: String,
        required: true,
        enum: ["soft cover", "hard cover"],
        },
    },
    { timestamps: true }
    );


    //CREATION DE MODELE
    const Book = mongoose.model("Book", shemaBook);


    //function validate donne create author
    function validateCreateAuthor(obj) {
    const schema = joi.object({
        title: joi.string().min(3).required(),
        author: joi.string().required(),
        description: joi.string().min(5).required(),
        price: joi.number().min(0).required(),
        cover: joi.string().valid("soft cover", "hard cover").required(),
    });
    return schema.validate(obj);
    }

    function validateUpdateAuthor(obj) {
    const schema = joi.object({
        title: joi.string().min(3),
        author: joi.string(),
        description: joi.string().min(5),
        price: joi.number().min(0),
        cover: joi.string().valid("soft cover", "hard cover"),
    });

    return schema.validate(obj);
    }
    module.exports = { Book, validateCreateAuthor, validateUpdateAuthor };
