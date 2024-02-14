const Router = require("express");
const router = new Router();
const usersellerRouter = require('./usersellerRouter')

router.use('/userseller', usersellerRouter)

module.exports = router