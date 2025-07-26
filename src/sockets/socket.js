const jwt = require('jsonwebtoken');
const { prisma } = require('../config/prismaClient');
const { findUserById } = require('../dao/auth/auth');


function getRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join('_'); // e.g., "user123_user456"
}

let user_socketMap = {};


const setupSockets = (io) => {
    io.use( async (socket, next) => {
        // const token = socket.handshake.auth.token;
        // if (!token) {
        //     return next(new Error('Authentication error: No token provied'));
        // }
        
        // try{
            // const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // const user = await findUserById(decoded.userId);

            // if (!user) {
            //     return next(new Error('Authentication error: User not found'));
            // }

            // socket.user = {
            //     id: user.id,
            //     first_name: user.first_name,
            //     last_name: user.last_name,
            //     role: user.user_roles[0].role,
            // };
            next();
        // }
        // catch(err){
        //     console.error('Socket authentication error:', err.message);
        //     return next(new Error('Authentication error: Invalid token'));
        // }
        console.log(socket.id);
        
    });

    io.on('connection', (socket) => {
 if (socket.user) {
    console.log(
      `User connected: ${socket.user.first_name} ${socket.user.last_name}`
    );
  }
        // console.log(`User connected: ${socket.user.first_name} ${socket.user.last_name}`);
        socket.on('testConnection', () => {
            socket.emit('testResponse', { message: `Hello ${socket.user.first_name}, socket server is working!`})
        })

        // my logic start here 
        //  socket.on("register", (userId)=>{
        //     user_socketMap[userId]= socket.id;
        //     console.log("user connected and socket is stored", userId);
            
        //     let allPrevCoversationsRooms = [];
        
            // for(converst of conversations){
            //   if(converst.user1 == userId || converst.user2 == userId){
            //     allPrevCoversationsRooms.push(converst.roomid); 
            //   }
            // }
        
            // if(allPrevCoversationsRooms.length > 0 ){
            //     socket.emit("all previous conversations", allPrevCoversationsRooms);
            // }
        //  })
        
        
         socket.on("startConversation", ({from , to})=>{
            let roomId = getRoomId(from, to);  //get room id if not exists
            let conversation = {user1 : from , user2 : to , roomid : roomId};
            conversations.push(conversation);
            console.log("a new conversation is stored in conversation table");
            
            socket.join(roomId);
        
            let sender_SocketId = user_socketMap[from];
            io.to(sender_SocketId).emit("roomidforsender", roomId); //send the roomid to client who initiated the chat
            console.log("user who initated joined the room and room id is sent to sender: ", sender_SocketId, "roomid:", roomId, "from: ",from );
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
        

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.first_name}, id - ${socket.user.id}`);
        });
    });
};


module.exports = setupSockets;