const prisma = require("../../config/prismaClient");

async function seedCatalogCourses() {
  try {
    await prisma.catalog_courses.createMany({
      data: [
        {
          catalog_id: 'catalog-1',
          course_id: 'course-1', // e.g., JS Basics
        },
        {
          catalog_id: 'catalog-1',
          course_id: 'course-2', // e.g., Node.js
        },
        {
          catalog_id: 'catalog-2',
          course_id: 'course-2', // e.g., DSA Level 1
        },
      ],
      skipDuplicates: true,
    });

    console.log(' Catalog–Course associations seeded');
  } catch (err) {
    console.error(' Error seeding catalog_courses:', err);
  }
}


module.exports = { seedCatalogCourses };
