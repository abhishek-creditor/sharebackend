const prisma = require("../../config/prismaClient");

async function seedUnits() {
  try {
    await prisma.units.createMany({
      data: [
        {
          id: 'unit-1',
          module_id: 'module-1',
          title: 'Variables and Data Types',
          description: 'Learn about let, const, var and different data types.',
          order: 1,
          unit_status: 'PUBLISHED',
        },
        {
          id: 'unit-2',
          module_id: 'module-1',
          title: 'Operators and Expressions',
          description: 'Understand arithmetic and logical operators.',
          order: 2,
          unit_status: 'PUBLISHED',
        },
        {
          id: 'unit-3',
          module_id: 'module-2',
          title: 'Function Declarations',
          description: 'How to write and use functions in JavaScript.',
          order: 1,
          unit_status: 'PUBLISHED',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Units seeded');
  } catch (err) {
    console.error('Error seeding units:', err);
  }
}



module.exports = { seedUnits };
