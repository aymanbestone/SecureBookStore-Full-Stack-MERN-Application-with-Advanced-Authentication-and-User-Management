const mongoose = require("mongoose");
const joi = require("joi");
const authorSchema = new mongoose.Schema(
  {
    firstname: { type: String , required: true , trim: true, minlength: 2},
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    }
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model("Author", authorSchema); // Utilisez Author ici
//function validate donne create author
function validateCreateAuthor(obj) {
  const shema = joi.object({
    firstname: joi.string().min(2).required(),
    lastname: joi.string().min(2).required(),
    nationality: joi.string().required(),
  });
  return shema.validate(obj);
}

function validateUpdateAuthor(obj) {
  const shema = joi.object({
    firstname: joi.string().min(2),
    lastname: joi.string().min(2),
    nationality: joi.string(),
  });

  return shema.validate(obj);
}

module.exports = { Author, validateCreateAuthor, validateUpdateAuthor }; // Assurez-vous que c'est Author ici
