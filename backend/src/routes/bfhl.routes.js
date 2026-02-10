const router = require("express").Router();
const controller = require("../controllers/bfhl.controller");

router.get("/health", controller.health);
router.post("/bfhl", controller.handleBFHL);

module.exports = router;
