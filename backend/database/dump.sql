INSERT    INTO "user" ("username", "email", "hashedPassword", "role", "createdAt", "updatedAt")
VALUES    (
          'coderminator',
          'coderminator@email.com',
          '$argon2id$v=19$m=19893.36898592844,t=2,p=1$1GbB4O6WVrTSU/l+UHWe2Q$ZqZkJRYWFWs9Kkj4bQuK72acQsSBehxReg6NA76l+wY',
          'user',
          '2025-04-05T10:13:14.755Z',
          '2025-04-05T10:13:14.755Z'
          ),
          (
          'admin',
          'admin@email.com',
          '$argon2id$v=19$m=65536,t=3,p=4$Ao25Zr0YiPg2fizA5RknGw$g/4TFztF07ZXpu8llmZnH/RhrlW6A6Vr156C+E7uB/U',
          'admin',
          '2025-06-12T07:38:45.614Z',
          '2025-06-12T07:38:45.614Z'
          );