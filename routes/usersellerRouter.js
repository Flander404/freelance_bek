const Router = require("express");
const usersellerController = require("../controllers/usersellerController");
const router = new Router();

router.post("/registration", usersellerController.registration);
router.post("/login", usersellerController.login);
router.post('/confirm-registration', usersellerController.confirmRegistration);
router.get("/auth", usersellerController.check);

module.exports = router;
