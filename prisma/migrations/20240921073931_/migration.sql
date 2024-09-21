-- CreateTable
CREATE TABLE "League" (
    "id" SERIAL NOT NULL,
    "invite_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "League_invite_code_key" ON "League"("invite_code");
