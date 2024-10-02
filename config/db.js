const mongoose = require("mongoose");

 async function connectTodb() {
  try {
    await  mongoose.connect(process.env.url_mongodb_connection);
    console.log("Connexion réussie !!!");
  } catch (eror) {
    console.log("Erreur de connexion :", error);
  }
}

module.exports= connectTodb