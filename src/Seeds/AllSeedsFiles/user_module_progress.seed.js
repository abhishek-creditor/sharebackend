const prisma = require("../../config/prismaClient");

async function seedUserModuleProgress() {
  try {
    await prisma.user_module_progress.createMany({
      data: [
        {
          id: 'ump-1',
          user_id: 'userId-1',
          module_id: 'module-1',
          completed: true,
        },
        {
          id: 'ump-2',
          user_id: 'userId-2',
          module_id: 'module-2',
          completed: false,
        },
      ],
      skipDuplicates: true,
    });

    console.log('User module progress seeded');
  } catch (err) {
    console.error('Error seeding user module progress:', err);
  }
}




module.exports = { seedUserModuleProgress };
