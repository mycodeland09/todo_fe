const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const url = process.env.DB_URL;

console.log("here is the url", url);

async function connectUsingMongoose() {
  try {
    await mongoose.connect(url);
    console.log("mongodb connected using mongoose");
  } catch (err) {
    console.log(err);
  }
}
module.exports = connectUsingMongoose;
