import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();

const cn = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

const db = pgp(cn!);

export default db;
