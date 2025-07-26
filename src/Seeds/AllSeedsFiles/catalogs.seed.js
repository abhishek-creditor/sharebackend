const prisma = require("../../config/prismaClient");

async function seedCatalogs() {
  try {
    await prisma.catalogs.createMany({
      data: [
        {
          id: 'catalog-1',
          name: 'Web Development',
          description: 'Courses focused on front-end and back-end web development.',
          thumbnail: 'https://example.com/thumbnails/web-dev.png',
        },
        {
          id: 'catalog-2',
          name: 'Data Structures & Algorithms',
          description: 'Core CS fundamentals and problem-solving techniques.',
          thumbnail: 'https://example.com/thumbnails/dsa.png',
        },
        {
          id: 'catalog-3',
          name: 'Interview Preparation',
          description: 'Prepare for coding interviews and system design rounds.',
          thumbnail: 'https://example.com/thumbnails/interview-prep.png',
        },
      ],
      skipDuplicates: true,
    });

    console.log(' Catalogs seeded');
  } catch (err) {
    console.error(' Error seeding catalogs:', err);
  }
}




module.exports = { seedCatalogs };
