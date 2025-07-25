const prisma = require("../../config/prismaClient");

async function seedOrderItems() {
  try {
    await prisma.order_items.createMany({
      data: [
        {
          id: 'item-1',
          order_id: 'order-1',
          price: 299.99,
          course_id: 'course-1',
        },
        {
          id: 'item-2',
          order_id: 'order-2',
          price: 149.49,
          catalog_id: 'catalog-2',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Order items seeded');
  } catch (err) {
    console.error('Error seeding order items:', err);
  }
}



module.exports = { seedOrderItems };
