const express = require("express");
const router = express.Router();
const userMiddleware = require("../middleware/usermiddleware");
const mistakeController = require("../controllers/mistakeController");

router.get("/",              userMiddleware, mistakeController.getAllMistakes);
router.get("/:problemId",    userMiddleware, mistakeController.getNoteByProblem);
router.post("/",             userMiddleware, mistakeController.createMistake);
router.put("/:id",           userMiddleware, mistakeController.updateMistake);
router.patch("/:id",         userMiddleware, mistakeController.markResolved);
router.delete("/:id",        userMiddleware, mistakeController.deleteMistake);

module.exports = router;