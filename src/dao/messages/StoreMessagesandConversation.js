const prisma = require("../../config/prismaClient");


async function getallConversationIds(userid) {
const userConversations = await prisma.users.findUnique({
  where: {
    id: userid,
  },
  select: {
    conversations_as_user1: {
      select: {
        conv_id: true,
      },
    },
    conversations_as_user2: {
      select: {
        conv_id: true,
      },
    },
  },
});



const allConversationIds = [
  ...userConversations.conversations_as_user1.map(c => c.conv_id),
  ...userConversations.conversations_as_user2.map(c => c.conv_id),
];

return allConversationIds;
}


async function storeToConversationDB(conversationId, sender_id, receiver_id){
return await prisma.conversations.create({
  data: {
    conv_id : conversationId,
    user1_id : sender_id,
    user2_id : receiver_id,
  },
})
}


async function getALlConversationMessages(roomid){
  return await prisma.conversations.findFirst({
  where: {
    conv_id : roomid,
  },
  include: {
    cov_messages : true,
  },
})
}


async function storeMsg(roomid, msg ,sender, receiver ) {
  return await prisma.chat_message.create({
  data: {
    sender_id: sender,
    receiver_id: receiver,
    content: msg,
    conversation_id: roomid
  },
})
}

module.exports = {getallConversationIds , storeToConversationDB, getALlConversationMessages, storeMsg};