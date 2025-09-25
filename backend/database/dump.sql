INSERT    INTO "user" ("id", "username", "email", "hashedPassword", "role", "createdAt", "updatedAt")
VALUES    (
          '338b707d-f37c-48b5-b75f-ef6a7b053e6a',
          'codejamer',
          'codejamer@email.com',
          '$argon2id$v=19$m=19893.36898592844,t=2,p=1$1GbB4O6WVrTSU/l+UHWe2Q$ZqZkJRYWFWs9Kkj4bQuK72acQsSBehxReg6NA76l+wY',
          'user',
          '2025-04-05T10:13:14.755Z',
          '2025-04-05T10:13:14.755Z'
          ),
          (
          '81931db1-02f5-4c6a-adf1-4e238952ffd2',
          'codejamer+',
          'codejamer-premium@email.com',
          '$argon2id$v=19$m=65536,t=3,p=4$QLX33e33r3iofa2RfQM6Pg$XaYT+g9yEmGj2+L0MXn2U7/wcxPA0nJq8uIVlvLsC7E',
          'user',
          '2025-05-15T23:53:45.846Z',
          '2025-05-15T23:53:45.846Z'
          ),
          (
          '280ed1b0-6f33-42e6-85d6-da068da613d7',
          'admin',
          'admin@email.com',
          '$argon2id$v=19$m=65536,t=3,p=4$Ao25Zr0YiPg2fizA5RknGw$g/4TFztF07ZXpu8llmZnH/RhrlW6A6Vr156C+E7uB/U',
          'admin',
          '2025-06-12T07:38:45.614Z',
          '2025-06-12T07:38:45.614Z'
          );

INSERT    INTO "plan" ("id", "name", "price", "executionLimit", "createdAt", "updatedAt")
VALUES    (
          'a4352d02-59e2-44a3-8dec-6bcc1056adc3',
          'guest',
          0,
          50,
          '2025-09-17T23:59:59.654Z',
          '2025-09-17T23:59:59.654Z'
          ),
          (
          '7fa381b8-0d39-4edc-9981-30b1d1a5f096',
          'free',
          0,
          200,
          '2025-07-05T09:45:01.987Z',
          '2025-07-05T09:45:01.987Z'
          ),
          (
          '3335f59c-e2fe-4fe8-8774-6d47cda0c337',
          'premium',
          4999,
          NULL,
          '2025-08-21T15:12:34.123Z',
          '2025-08-21T15:12:34.123Z'
          );

INSERT    INTO "user_subscription" (
          "userId",
          "planId",
          "subscribedAt",
          "expiresAt",
          "terminatedAt",
          "cancellationReason"
          )
VALUES   
          -- codejamer / free
          (
          '338b707d-f37c-48b5-b75f-ef6a7b053e6a',
          '7fa381b8-0d39-4edc-9981-30b1d1a5f096',
          '2025-08-10T14:32:11.421Z',
          NULL, -- no expiration date
          NULL,
          NULL
          ),
          -- codejamer+ / premium
          (
          '81931db1-02f5-4c6a-adf1-4e238952ffd2',
          '3335f59c-e2fe-4fe8-8774-6d47cda0c337',
          '2025-07-01T09:00:00.000Z',
          '2026-07-01T09:00:00.000Z', -- expiresAt (1-year subscription)
          NULL,
          NULL
          ),
          -- admin / premium (terminated)
          (
          '280ed1b0-6f33-42e6-85d6-da068da613d7',
          '3335f59c-e2fe-4fe8-8774-6d47cda0c337',
          '2025-01-15T12:45:33.900Z',
          '2026-01-15T12:45:33.900Z', -- expiresAt (1-year subscription)
          NULL,
          NULL
          );