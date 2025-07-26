const prisma = require("../../config/prismaClient");

async function seedGroupMembers() {
  try {
    await prisma.group_member.createMany({
      data: [
        { group_id: 'group-1', user_id: 'userId-1' },
        { group_id: 'group-1', user_id: 'userId-2' },
        { group_id: 'group-2', user_id: 'userId-2' },
      ],
      skipDuplicates: true,
    });

    console.log('Group members seeded');
  } catch (err) {
    console.error('Error seeding group members:', err);
  }
}



module.exports = { seedGroupMembers };
