const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://localhost:27017/elitestays";
async function connect() {
  await mongoose.connect(MONGO_URL);
}
connect()
  .then(() => {
    console.log("Database is sucessfully connected");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67fe61a80dc25fa6ca58ec36",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data is initialized");
};

initDB();
