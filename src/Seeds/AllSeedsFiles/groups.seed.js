const prisma = require("../../config/prismaClient");

async function seedGroups() {
  try {
    await prisma.groups.createMany({
      data: [
        {
          id: 'group-1',
          name: 'Frontend Developers',
          description: 'A group for discussing HTML, CSS, and JavaScript',
          created_by: 'userId-1',
        },
        {
          id: 'group-2',
          name: 'Backend Engineers',
          description: 'All things related to Node.js, databases, and APIs',
          created_by: 'userId-2',
        },
        {
          id: 'group-3',
          name: 'DevOps Gurus',
          description: 'CI/CD, cloud infrastructure, and more',
          created_by: 'userId-3',
        },
        {
          id: 'group-4',
          name: 'AI Enthusiasts',
          description: 'Deep learning, ML models, and data science topics',
          created_by: 'userId-4',
        },
        {
          id: 'group-5',
          name: 'UI/UX Designers',
          description: 'Design principles, prototyping tools, and feedback',
          created_by: 'userId-5',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Groups seeded');
  } catch (err) {
    console.error('Error seeding groups:', err);
  }
}



module.exports = { seedGroups };
