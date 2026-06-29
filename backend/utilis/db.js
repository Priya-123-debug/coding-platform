const mongoose = require("mongoose");
const Schema = mongoose.Schema;
async function main() {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log("Database connected successfully", conn.connection.host);
  } catch (error) {
    console.log("Database connection failed", error.message);
  }
}
module.exports = main;
