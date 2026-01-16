const { PrismaClient } = require('@prisma/client');
const { Resend } = require('resend');
const mockDeals = require('../data/mock-deals.json');

const prisma = new PrismaClient();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function checkAlerts() {
  const premiumUsers = await prisma.user.findMany({
    where: { isPremium: true },
    include: { searches: true }
  });

  for (const user of premiumUsers) {
    for (const search of user.searches) {
      const bestDeal = mockDeals[0];
      if (!bestDeal) continue;

      const previousAlert = await prisma.alert.findFirst({
        where: { searchId: search.id },
        orderBy: { triggeredAt: 'desc' }
      });

      const oldPrice = previousAlert?.newPrice ?? search.budget + 50;
      if (bestDeal.minPrice < oldPrice) {
        await prisma.alert.create({
          data: {
            userId: user.id,
            searchId: search.id,
            oldPrice,
            newPrice: bestDeal.minPrice
          }
        });

        if (resend) {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'alerts@arzum.ai',
            to: user.email,
            subject: `Price drop: ${bestDeal.destination} from €${bestDeal.minPrice}`,
            html: `<p>New deal for ${bestDeal.destination}: €${bestDeal.minPrice}.</p>`
          });
        }
      }
    }
  }
}

async function start() {
  await checkAlerts();
  setInterval(checkAlerts, 15 * 60 * 1000);
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
