const express = require('express');
let {storeConversation, LoadPreviousConversation, StoreMessage, searchUser, getAllConversations} = require('../../controllers/messages/privateMessaging');

function socketrouter(io){
  const router = express.Router();
    router.post("/getAllConversation", getAllConversations);
    router.post("/startnewconversation", storeConversation); //we create a new room and store the conversation/room id conversation table
    router.post("/PreviousConversation", LoadPreviousConversation ); //we join the previously created room
    router.post("/sendMessage", StoreMessage); // we also get the conversation/room id, user1 , user2 id  //we store the message in database and also emitt in room
    router.post("/search", searchUser);

  return {
    router,
  }

}


module.exports = socketrouter;