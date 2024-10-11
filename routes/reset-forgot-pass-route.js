const express = require("express");
const router = express.Router();
const {renderEmailForm,sendLinkEmail,renderFormUpdate,updateUserPassword}=require("../controllers/reset-forgot-pass-Controller")


router.route("/").get(renderEmailForm).post(sendLinkEmail)

router.route("/:id/:token").get(renderFormUpdate).post(updateUserPassword)






module.exports= router
