-- Media uploads with moderation (RBAC: volunteers upload to a queue, content managers moderate)
CREATE TYPE "ModerationStatus" AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE "media_assets" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "kind" VARCHAR(10) NOT NULL DEFAULT 'image',
    "width" INTEGER,
    "height" INTEGER,
    "bytes" INTEGER,
    "alt" VARCHAR(300),
    "caption" TEXT,
    "album" VARCHAR(120),
    "event_id" INTEGER,
    "uploaded_by" INTEGER,
    "moderation_status" "ModerationStatus" NOT NULL DEFAULT 'pending',
    "moderated_by" INTEGER,
    "moderated_at" TIMESTAMP(3),
    "rejection_reason" VARCHAR(300),
    "consent_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "faces_blurred" BOOLEAN NOT NULL DEFAULT false,
    "taken_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "media_assets_moderation_status_created_at_idx" ON "media_assets"("moderation_status", "created_at");
CREATE INDEX "media_assets_event_id_idx" ON "media_assets"("event_id");
CREATE INDEX "media_assets_uploaded_by_created_at_idx" ON "media_assets"("uploaded_by", "created_at");

ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_moderated_by_fkey" FOREIGN KEY ("moderated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Approval workflow statuses (content created by non-admins waits here)
INSERT INTO "campaign_statuses" ("name", "description", "display_order") VALUES ('pending_review', 'Waiting for Super Admin approval', 1) ON CONFLICT ("name") DO NOTHING;
INSERT INTO "event_statuses" ("name", "description", "display_order") VALUES ('pending_review', 'Waiting for Super Admin approval', 1) ON CONFLICT ("name") DO NOTHING;
INSERT INTO "blog_post_statuses" ("name", "description", "display_order", "is_published") VALUES ('pending_review', 'Waiting for Super Admin approval', 1, false) ON CONFLICT ("name") DO NOTHING;
