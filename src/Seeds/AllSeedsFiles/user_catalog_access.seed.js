const prisma = require("../../config/prismaClient");

async function seedUserCatalogAccess() {
  try {
    await prisma.user_catalog_access.createMany({
      data: [
        {
          id: 'access-1',
          user_id: 'userId-1',
          catalog_id: 'catalog-1',
          granted_by: "MANUAL",
          status: "ACTIVE",
        },
        {
          id: 'access-2',
          user_id: 'userId-2',
          catalog_id: 'catalog-2',
          granted_by: "MANUAL",
          status: "ACTIVE",
        },
      ],
      skipDuplicates: true,
    });

    console.log('User catalog access seeded');
  } catch (err) {
    console.error('Error seeding user catalog access:', err);
  }
}



module.exports = { seedUserCatalogAccess };
