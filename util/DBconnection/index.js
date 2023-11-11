const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  database: "blog",
  user: "root",
  password: "",
});

const DB = connection.connect((err) => {
  if (err) return console.log("Error occured while connecting to database");
  console.log("Connected to Database");
});

module.exports = { DB };
