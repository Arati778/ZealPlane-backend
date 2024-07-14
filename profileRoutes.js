const express = require("express");
const { getProfileId } = require("./controllers/profileController");

router.route("/:id").get(getProfileId);

