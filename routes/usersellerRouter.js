const Router = require("express");
const usersellerController = require("../controllers/usersellerController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();

router.post("/registration", usersellerController.registration);
router.post("/login", usersellerController.login);
router.post("/confirm-registration", usersellerController.confirmRegistration);
router.post("/varify-inn", usersellerController.varify_inn);
router.get("/", authMiddleware, usersellerController.getuser);

module.exports = router;
