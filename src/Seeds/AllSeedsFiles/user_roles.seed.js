const prisma = require("../../config/prismaClient");

async function seedUserRoles() {
  try {
    await prisma.user_roles.createMany({
      data: [
        {
          user_id: 'userId-1',
          role: 'admin',
        },
        {
          user_id: 'userId-2',
          role: 'instructor',
        },
        {
          user_id: 'userId-2',
          role: 'user',
        },
      ],
      skipDuplicates: true,
    });

    console.log('User roles seeded');
  } catch (err) {
    console.error('Error seeding user roles:', err);
  }
}

module.exports = { seedUserRoles };
