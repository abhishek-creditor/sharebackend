const prisma = require("../../config/prismaClient");

async function seedLessonResources() {
  try {
    await prisma.lesson_resource.createMany({
      data: [
        {
          id: 'resource-1',
          lesson_id: 'lesson-1',
          resource_type: "TEXT",
          url: 'https://example.com/js-variables.mp4',
          description: 'Video on variable declarations',
          is_preview: true,
          duration: 300,
          file_size: 5000,
        },
        {
          id: 'resource-2',
          lesson_id: 'lesson-2',
          resource_type: "TEXT",
          url: 'https://example.com/data-types.pdf',
          description: 'PDF summary of JavaScript data types',
          is_preview: false,
          file_size: 1200,
        },
        {
          id: 'resource-3',
          lesson_id: 'lesson-3',
          resource_type: "TEXT",
          url: '',
          description: 'Written content explaining function declaration syntax.',
          is_preview: true,
          file_size: 300,
        },
      ],
      skipDuplicates: true,
    });

    console.log('Lesson resources seeded');
  } catch (err) {
    console.error('Error seeding lesson resources:', err);
  }
}



module.exports = { seedLessonResources };
