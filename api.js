const express = require("express");
const app = express();
const { error404, error500 } = require("./middlwares/eror");
//pour configurer le fichier config
require("dotenv").config();

//connection
const connectTodb = require("./config/db");
connectTodb();
//apply middlewares
app.use(express.json());

// app.use(logger);

// apply routes
app.use("/book", require("./routes/book"));
app.use("/authors", require("./routes/author"));
app.use("/authUsers", require("./routes/authUser"));
app.use("/users", require("./routes/users"));

//eror handling middlware
app.use(error404);
app.use(error500);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`serveur is running for ${process.env.NODE_ENV} in port ${PORT}`)
);
