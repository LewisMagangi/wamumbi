-- Website form submissions: volunteer applications and partnership inquiries
CREATE TYPE "InquiryKind" AS ENUM ('volunteer', 'partnership');
CREATE TYPE "InquiryStatus" AS ENUM ('new', 'in_review', 'accepted', 'declined', 'archived');

CREATE TABLE "inquiries" (
    "id" SERIAL NOT NULL,
    "kind" "InquiryKind" NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(40),
    "payload" JSONB NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'new',
    "handled_by" INTEGER,
    "handled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "inquiries_kind_status_created_at_idx" ON "inquiries"("kind", "status", "created_at");

ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_handled_by_fkey" FOREIGN KEY ("handled_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
