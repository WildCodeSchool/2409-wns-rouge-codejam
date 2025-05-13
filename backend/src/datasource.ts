import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST ?? 'db',
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  // synchronize: process.env.NODE_ENV === 'production' ? false : true,
  synchronize: true,
  // logging: process.env.NODE_ENV === 'production' ? false : true,
  logging: true,
  entities: ['./src/entities/*.ts'],
  subscribers: [],
  migrations: [],
})
