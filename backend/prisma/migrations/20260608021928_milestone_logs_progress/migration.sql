-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "salesNotes" TEXT;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "address" TEXT,
ADD COLUMN     "nik" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "jumlahKontraktor" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "kontraktorName" TEXT,
ADD COLUMN     "nilaiKontrak" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "nomorIzin" TEXT;

-- AlterTable
ALTER TABLE "PropertyType" ADD COLUMN     "estimasiRab" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "facilities" TEXT;

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "luasTanahAktual" DOUBLE PRECISION,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "spkId" TEXT,
ADD COLUMN     "svgPathId" TEXT;

-- CreateTable
CREATE TABLE "Spk" (
    "id" TEXT NOT NULL,
    "spkNo" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "contractorName" TEXT NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Menunggu Transfer',
    "bookingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "salesId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KprApplication" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "bankName" TEXT,
    "plafondPengajuan" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "plafondDisetujui" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'Kumpul Berkas',
    "isPlafonTurun" BOOLEAN NOT NULL DEFAULT false,
    "selisihPlafon" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KprApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KprDocument" (
    "id" TEXT NOT NULL,
    "kprApplicationId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KprDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MilestoneTemplate" (
    "id" TEXT NOT NULL,
    "propertyTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orderNo" INTEGER NOT NULL,
    "bobotPersentase" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MilestoneTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orderNo" INTEGER NOT NULL,
    "targetDate" TIMESTAMP(3),
    "actualDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "photoUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bobotPersentase" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MilestoneLog" (
    "id" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "photoUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reportedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MilestoneLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Spk_spkNo_key" ON "Spk"("spkNo");

-- CreateIndex
CREATE UNIQUE INDEX "KprApplication_bookingId_key" ON "KprApplication"("bookingId");

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_spkId_fkey" FOREIGN KEY ("spkId") REFERENCES "Spk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KprApplication" ADD CONSTRAINT "KprApplication_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KprDocument" ADD CONSTRAINT "KprDocument_kprApplicationId_fkey" FOREIGN KEY ("kprApplicationId") REFERENCES "KprApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneTemplate" ADD CONSTRAINT "MilestoneTemplate_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneLog" ADD CONSTRAINT "MilestoneLog_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
