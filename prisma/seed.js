const { PrismaClient } = require('@prisma/client');
const airports = require('../data/airports.json');

const prisma = new PrismaClient();

async function main() {
  for (const airport of airports) {
    await prisma.airport.upsert({
      where: { iata: airport.iata },
      update: {},
      create: airport
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
