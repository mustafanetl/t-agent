CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Airport" (
    "id" TEXT NOT NULL,
    "iata" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Search" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "origins" TEXT[],
    "tripLength" TEXT NOT NULL,
    "departFrom" TEXT,
    "departTo" TEXT,
    "budget" INTEGER NOT NULL,
    "vibeTags" TEXT[],
    "partyType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Search_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "minPrice" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "deepLink" TEXT NOT NULL,
    "departFrom" TEXT NOT NULL,
    "departTo" TEXT NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payloadJson" JSONB NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "searchId" TEXT NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oldPrice" INTEGER NOT NULL,
    "newPrice" INTEGER NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");
CREATE UNIQUE INDEX "Airport_iata_key" ON "Airport"("iata");

ALTER TABLE "Search" ADD CONSTRAINT "Search_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "Search"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
