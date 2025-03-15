const { connect, disconnect } = require("mongoose");

async function connectToDatabase() {
  try {
    await connect(process.env.MONGODB_URI);
    console.log("Connected to database 🗃️");
  } catch (error) {
    console.log(" ❌ Error connecting to database", error);
    throw new Error("Error connecting to database");
  }
}

async function disconnectFromDatabase() {
  try {
    await disconnect();
  } catch (error) {
    console.log(error);
    throw new Error("Could not Disconnect From MongoDB");
  }
}

module.exports = { connectToDatabase, disconnectFromDatabase };
