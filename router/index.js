const router = require("express").Router();
const { getServerHome } = require("../controllers/index.js")

router.get("/" , getServerHome)

module.exports = router;