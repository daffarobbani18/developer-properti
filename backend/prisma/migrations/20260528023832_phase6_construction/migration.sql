-- CreateTable
CREATE TABLE "ConstructionProgress" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrl" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recordedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConstructionProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConstructionProgress" ADD CONSTRAINT "ConstructionProgress_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstructionProgress" ADD CONSTRAINT "ConstructionProgress_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
