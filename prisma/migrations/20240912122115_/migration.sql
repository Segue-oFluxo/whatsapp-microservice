-- CreateTable
CREATE TABLE "messages" (
    "message_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "instance_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "callback" TEXT NOT NULL,
    "eventid" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "messages_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "instances" ("instance_id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "instances" (
    "instance_id" TEXT NOT NULL PRIMARY KEY,
    "callback" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
