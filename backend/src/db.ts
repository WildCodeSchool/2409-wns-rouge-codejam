import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: process.env.NODE_ENV === 'production' ? false : true,
  entities: ['./src/entities/*.ts'],
  subscribers: [],
  migrations: [],
})
