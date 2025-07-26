// Chat file for direct messaging and gropu messaging
const express = require('express');
const app = express();
const { createServer } = require('node:http');
const server = createServer(app);
const { join } = require('node:path');
const { Server } = require('socket.io');
const io = new Server(server);
let conversations = require('./db');

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});


function getRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join('_'); // e.g., "user123_user456"
}

let user_socketMap = {};


io.on('connection', (socket) => {
 socket.on("register", (userId)=>{
    user_socketMap[userId]= socket.id;
    console.log("user connected and socket is stored", userId);
    
    let allPrevCoversationsRooms = [];

    for(converst of conversations){
      if(converst.user1 == userId || converst.user2 == userId){
        allPrevCoversationsRooms.push(converst.roomid); 
      }
    }

    if(allPrevCoversationsRooms.length > 0 ){
        socket.emit("all previous conversations", allPrevCoversationsRooms);
    }

 })


 socket.on("startConversation", ({from , to})=>{
    let roomId = getRoomId(from, to);  //get room id if not exists
    let conversation = {user1 : from , user2 : to , roomid : roomId};
    conversations.push(conversation);
    console.log("a new conversation is stored in conversation table");
    
    socket.join(roomId);

    let sender_SocketId = user_socketMap[from];
    io.to(sender_SocketId).emit("roomidforsender", roomId); //send the roomid to client who initiated the chat
    console.log("user who initated joined the room and room id is sent to sender: ", sender_SocketId, "roomid:", roomId, "from: ",from );
    

  //  let receiver_SocketId = user_socketMap[to];
  //   if(receiver_SocketId){
  //     socket.to(receiver_SocketId).emit("joinroomrequest", roomId);
      // console.log("the room id is sent to second user");
    // }
 })

  socket.on("joinRoom", (roomID)=>{
    socket.join(roomID);
    console.log("A user joint");
  });

   socket.on('sendMessage', ({room, from, to, message }) => {
    console.log(room);
    console.log(from);
    io.to(room).emit('receiveMessage', { from, message });
    console.log("message emmited to room");
    
  });

});


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});