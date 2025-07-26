const prisma = require("../../config/prismaClient");

async function seedUsers() {
  try {
    await prisma.users.createMany({
      data: [
        {
          id : "userId-1",
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          dob: new Date('1990-01-01'),
          password: 'securehashedpwd',
        },
        {
          id : "userId-2",
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
          phone: '9876543210',
          dob: new Date('1992-02-02'),
          password: 'securehashedpwd',
        },
        {
          id : "userId-3",
          first_name: 'Md',
          last_name: 'Zubair',
          email: 'zubi@example.com',
          phone: '9876587210',
          dob: new Date('1992-02-02'),
          password: 'securehashedpwd',
        },
      ],
      skipDuplicates: true,
    });

    console.log(' Users seeded');
  } catch (err) {
    console.error(' Error seeding users:', err);
  }
}


module.exports = { seedUsers };
