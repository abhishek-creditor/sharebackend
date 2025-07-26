const prisma = require("../../config/prismaClient");

async function seedContactUs() {
  try {
    await prisma.contactus.createMany({
      data: [
        {
          id: 'contact-1',
          first_name: 'Zara',
          last_name: 'Khan',
          phone: '9876543210',
          email: 'zara@example.com',
          message: 'I have a question regarding course enrollment.',
        },
        {
          id: 'contact-2',
          first_name: 'Rahul',
          last_name: 'Sharma',
          phone: '9123456780',
          email: 'rahul@example.com',
          message: 'When does the next batch start?',
        },
      ],
      skipDuplicates: true,
    });

    console.log('ContactUs entries seeded');
  } catch (err) {
    console.error('Error seeding ContactUs:', err);
  }
}


module.exports = { seedContactUs };
