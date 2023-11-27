const express = require("express");
const router = express.Router();
const { login, session } = require("../controllers/auth");

router.get("/session", session);
router.post("/login", login);

module.exports = router;
