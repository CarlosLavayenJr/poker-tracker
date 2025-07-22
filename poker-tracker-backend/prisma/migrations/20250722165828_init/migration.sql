-- CreateEnum
CREATE TYPE "game_type" AS ENUM ('TOURNAMENT', 'CASH');

-- CreateEnum
CREATE TYPE "medium" AS ENUM ('IRL', 'ONLINE');

-- CreateTable
CREATE TABLE "poker_sessions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "gameType" "game_type" NOT NULL,
    "" "medium" NOT NULL,
    "location" TEXT NOT NULL,
    "buyIn" DOUBLE PRECISION NOT NULL,
    "cashOut" DOUBLE PRECISION,
    "profit" DOUBLE PRECISION,
    "profitPerHour" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "poker_sessions_pkey" PRIMARY KEY ("id")
);
