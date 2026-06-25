const { Pool } = require("pg");

const pgpool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sheet",
  password: "12345678",
  port: "5432",
});

module.exports =  pgpool;
