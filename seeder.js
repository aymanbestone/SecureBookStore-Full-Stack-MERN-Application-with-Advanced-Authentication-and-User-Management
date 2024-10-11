const { Book } = require("./models/Book"); //IMPORTER LE MODELE DE LA COLLECTION
const { Author } = require("./models/Author"); //IMPORTER LE MODELE DE LA COLLECTION
const { books, authors } = require("./data"); //IMPORTER LE TABLEAU DES OBJET DE DATA
const connectTodb = require("./config/db"); //IMPORTER LA FONCTION DE CONECT DB
require("dotenv").config(); //IMPORTER DOTENV ET LA CONFIGURER

//connection to db
connectTodb(); //CONNECTER

//import books (seending)
const importBooks = async () => {
  try {
    await Book.insertMany(books); //INSERTION DES OBJET A LA FOIS DE TABLEAU
    console.log("books imported !!");
  } catch (eror) {
    console.log(eror);
    process.exit(1);
  }
};
//import authors (seending)
const importAuthors = async () => {
  try {
    await Author.insertMany(authors); //INSERTION DES OBJET A LA FOIS DE TABLEAU
    console.log("authors imported !!");
  } catch (eror) {
    console.log(eror.message);
    process.exit(1);
  }
};

//remove books
const removesBooks = async () => {
  try {
    await Book.deleteMany(); //SUPPRIMER TOUS LES OBJET DE LA COLLECTION
    console.log("books removed !!");
  } catch (eror) {
    console.log(eror);
    process.exit(1);
  }
};
//remove authors
const removesAuthors = async () => {
  try {
    await Author.deleteMany(); //SUPPRIMER TOUS LES OBJET DE LA COLLECTION
    console.log("authors removed !!");
  } catch (eror) {
    console.log(eror);
    process.exit(1);
  }
};

//PROCESS.ARGB C LA LIGNE QUI FAIT RUNNER NOTRE FICHIER : node seeder ....
if (process.argv[2] === "-import") {
  //process.argv[2] c'est le troixieme argument " ..."
  importBooks();
} else if (process.argv[2] === "-remove") {
  removesBooks();
} else if (process.argv[2] === "-import-authors") {
  importAuthors();
} else if (process.argv[2] === "-remove-authors") {
  removesAuthors();
}
