// DNS fix (taaki local run karne par Atlas SRV error na de)
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

if (!dbUrl) {
  console.error("Error: ATLASDB_URL is not defined in your .env file!");
  process.exit(1);
}

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("connected to DB");
    initDB();
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });

const initDB = async () => {
  try {
    // Purana data clear karo
    await Listing.deleteMany({});
    
    // Har listing ke sath teri owner ID attach karo
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "6add197c2d92ab78cb65bb38",
    }));

    await Listing.insertMany(initData.data);
    console.log("Sample Data was initialized successfully!");
  } catch (err) {
    console.log("Initialization Error:", err);
  } finally {
    // Process ko cleanly close karo
    mongoose.connection.close();
  }
};
