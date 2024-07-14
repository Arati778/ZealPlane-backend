const express = require("express");
const router = express.Router();
const { getContact} = require("./controllers/contactController")
const { updateContact } = require("./controllers/contactController")
const { createContact } = require("./controllers/contactController")
const { getContactS } = require("./controllers/contactController")
const { deleteContact } = require("./controllers/contactController");
const ValidateToken = require("./midleware/validateTokenHandler");

router.use(ValidateToken);

router.route("/").get(getContactS).post(createContact);

router.route("/:id").put(updateContact).get(getContact).delete(deleteContact);


module.exports = router;
