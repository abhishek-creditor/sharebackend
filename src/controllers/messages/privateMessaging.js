const express = require('express');
const app = express();
const { createServer } = require('node:http');
const server = createServer(app);
const { join } = require('node:path');
const { Server } = require('socket.io');
const io = new Server(server);
const {storeToConversationDB, getALlConversationMessages, storeMsg , getallConversationIds} = require('../../dao/messages/StoreMessagesandConversation.js');

function getRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join('_'); // e.g., "user123_user456"
}


const getAllConversations = async(req, res)=>{ //console.log("this function will get back all the rooms/conversation for a particular user");
   let userid = req.user.id;
   let allConversationIds = await getallConversationIds(userid);
   res.json({allConversationIds});
}

const storeConversation = async(req, res)=>{
   let receiver_id = req.body.reciverid;
   let sender_id = req.user.id;
   let conversationId =  getRoomId(sender_id, receiver_id);
   await storeToConversationDB(conversationId, sender_id, receiver_id);
   res.send("a new conversation is stored in the database with the respective sender and receiver");
    
}

const LoadPreviousConversation = async(req, res)=>{  // console.log("this is load converstion controller");
    let roomid = req.body.roomid;
    let messages = await getALlConversationMessages(roomid);
    res.json({messages});
} 


const StoreMessage = async (req, res)=>{
    let roomid = req.body.roomid;
    let msg = req.body.message;
    let sender = req.body.senderid;
    let receiver = req.body.receiver;
    await storeMsg(roomid, msg ,sender, receiver );
    res.json({ result :"message stored succesfully"});    
} 

const searchUser = (req, res)=>{
    console.log("this searches user in the database"); 
}


module.exports = {getAllConversations ,storeConversation, LoadPreviousConversation, StoreMessage, searchUser};