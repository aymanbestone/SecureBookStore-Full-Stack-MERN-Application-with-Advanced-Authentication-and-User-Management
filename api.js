const express = require("express");
const app = express();
const path = require("path");
const helmet = require("helmet");
const cors =require("cors")
const { error404, error500 } = require("./middlwares/eror");

//pour configurer le fichier config
require("dotenv").config();
app.set("view engine", "ejs");

//connection
const connectTodb = require("./config/db");
connectTodb();

//apply middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//helmet
app.use(helmet());

//cors
app.use(cors({
  origin: "https://localhost:5000"
}))

// static middlwarees
app.use(express.static(path.join(__dirname, "images")));

// apply routes
app.use("/book", require("./routes/book"));
app.use("/authors", require("./routes/author"));
app.use("/authUsers", require("./routes/authUser"));
app.use("/users", require("./routes/users"));
app.use("/forgot-password/", require("./routes/reset-forgot-pass-route"));
app.use("/api-upload/", require("./routes/upload"));

//eror handling middlware
app.use(error404);
app.use(error500);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`serveur is running for ${process.env.NODE_ENV} in port ${PORT}`)
);
