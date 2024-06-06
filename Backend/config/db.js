import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.USER, 
    password: process.env.PASSWORD, 
    host: process.env.HOST, 
    port: process.env.DB_PORT, 
    database: "e-commerce(sujal)" 
});

console.log("DB connected");

export default pool;
