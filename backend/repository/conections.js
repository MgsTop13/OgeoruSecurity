import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const conexao = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync("./ca.pem")
  }
});

export { conexao };


/*
BANCO MGS
const conexao = await mysql.createConnection({
    local: 'localhost',        
    user: 'Mgs',
    password: 'Potato10!',
    database: 'Mgs'
});

BANCO FREI
const conexao = await mysql.createConnection({
    local: 'localhost',
    user: 'root',
    password: '1234',
    database: 'Tcc'
});

BANCO ONLINE

const conexao = await mysql.createConnection({
  host: 'ogeorussecurity-mgs350084-6fb6.c.aivencloud.com',
  port: 21457,
  user: 'Mgs',
  password: 'Potato10!',
  database: 'defaultdb',
  ssl: {
    ca: fs.readFileSync('./ca.pem')
  }
});

*/
