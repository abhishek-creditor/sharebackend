// checkConnections.js
const prisma = require('../config/prismaClient')

async function checkConnections() {
  try {
    const metrics = await prisma.$metrics.json();
    console.log('Active Connections:', metrics.pool.active_connections);
    console.log('Idle Connections:', metrics.pool.idle_connections);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkConnections();