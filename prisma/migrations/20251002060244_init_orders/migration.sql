-- CreateTable
CREATE TABLE "OrderStats" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,
    "delivery" INTEGER NOT NULL,

    CONSTRAINT "OrderStats_pkey" PRIMARY KEY ("id")
);
