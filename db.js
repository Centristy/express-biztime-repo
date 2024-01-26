/** Database setup for BizTime. */

const { Client } = require("pg");

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql:///biztime_test";
} else {
  DB_URI = "postgresql:///biztime";
}

/**  For MacOS: change "/var/run/postgresql" to "/tmp  */

let db = new Client({
    host: "/var/run/postgresql",
    database: "biztime"
  });

db.connect();

module.exports = db;
