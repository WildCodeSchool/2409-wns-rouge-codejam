CREATE    TYPE "UserRole" AS ENUM('user', 'admin');

CREATE    TABLE "user" (
          "id" UUID DEFAULT gen_random_uuid () PRIMARY KEY,
          "username" VARCHAR(32) UNIQUE,
          "email" VARCHAR(320) NOT NULL UNIQUE,
          "hashedPassword" VARCHAR(150) NOT NULL,
          "role" "UserRole" NOT NULL DEFAULT 'user',
          "createdAt" TIMESTAMP NOT NULL,
          "updatedAt" TIMESTAMP NOT NULL
          );