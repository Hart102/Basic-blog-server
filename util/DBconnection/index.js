const mysql = require("mysql");
require("dotenv").config();

// const connection = mysql.createConnection({
//   host: "localhost",
//   database: "blog",
//   user: "root",
//   password: "",
// });

// db Connection: https://www.db4free.net/phpMyAdmin/index.php?route=/database/structure&db=hart1024

const connection = mysql.createConnection({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.DATABASE_USER,
  password: process.env.PASSWORD,
});


connection.connect((err) => {
  if (err) return console.log("Error occured while connecting to database");
  console.log("Connected to Database");
});

module.exports = { connection };

