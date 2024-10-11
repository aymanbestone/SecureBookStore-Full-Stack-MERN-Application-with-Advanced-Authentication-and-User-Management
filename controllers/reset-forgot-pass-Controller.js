const { User, validateResetPass } = require("../models/User");
const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
/**
 * @desc rendering page pour faire ecrire email
 * @route /forgot-password/
 * @method get
 * @access public
 */
const renderEmailForm = asynchandler(async (req, res) => {
  res.render("email-form");
});
/**
 * @desc construire un link et l'envoyer
 * @route /forgot-password/
 * @method post
 * @access public
 */
const sendLinkEmail = asynchandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const secret = process.env.secret_key + user.password;
  const token = jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "10m",
  });
  const link = `http://192.168.11.137:5000/forgot-password/${user.id}/${token}`;

  const transporteur = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_PERSONNEL,
      pass: process.env.MDP_EMAIL_PERSONNEL,
    },
  });
  const emailOption = {
    from: process.env.EMAIL_PERSONNEL,
    to: user.email,
    subject: "reset password",
    html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Réinitialisation du Mot de Passe</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .link-container {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .link {
                    display: inline-block;
                    padding: 10px 20px;
                    color: #ffffff;
                    background-color: #007bff;
                    text-decoration: none;
                    border-radius: 4px;
                    transition: background-color 0.3s ease;
                }
                .link:hover {
                    background-color: #0056b3;
                }
                .link-text {
                    margin-top: 10px;
                    color: #333;
                }
            </style>
        </head>
        <body>
            <div class="link-container">
                <a href="${link}" class="link">Cliquez ici pour réinitialiser votre mot de passe</a>
                <p class="link-text">Vous serez redirigé vers notre plateforme.</p>
                <p class="link-text">ne partager ce link avec personne</p>
                <p class="link-text">attention !!</p>
            </div>
        </body>
        </html>
     `,
  };
  transporteur.sendMail(emailOption, function (error, sucess) {
    if (error) {
      res.json({ message: eror.message });
    } else {
      res.render("verify-link-email");
    }
  });
});
/**
 * @desc get form pour updater
 * @route /forgot-password/:id/:token
 * @method get
 * @access public
 */
const renderFormUpdate = asynchandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const secret = process.env.secret_key + user.password;

  try {
    jwt.verify(req.params.token, secret);
    res.render("update-form-view");
  } catch (eror) {
    return res.json(eror);
  }
});
/**
 * @desc updater et render the sucess page
 * @route /forgot-password/:id/:token
 * @method post
 * @access public
 */
const updateUserPassword = asynchandler(async (req, res) => {
  const { eror } = validateResetPass(req.body.password);
  if (eror) {
    res.status(400).json({ message: eror });
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const secret = process.env.secret_key + user.password;
  try {
    jwt.verify(req.params.token, secret);
    const salt = await bcryptjs.genSalt(10);
    req.body.password = await bcryptjs.hash(req.body.password, salt);
    user.password = req.body.password;
    await user.save();
    res.render("sucess-password-view");
  } catch (eror) {
    return res.json(eror);
  }
});

module.exports = {
  renderEmailForm,
  sendLinkEmail,
  renderFormUpdate,
  updateUserPassword,
};
