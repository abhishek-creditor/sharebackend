const express = require('express');
const router = express.Router();

let {displayquestions, getAnswer, sendDetails , contactAll} = require("../../controllers/chatbot/chatbotController.js");




router.get("/chatsection", displayquestions);

router.post("/chatQuestion", getAnswer );

router.post("/contact" , sendDetails);

router.post("/contactall", contactAll);


module.exports = router;