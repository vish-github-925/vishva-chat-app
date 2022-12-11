const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI_PROD);
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error connecting to MongoDB ${error.message}`.red.underline);
    process.exit(1);
  }
};

module.exports = connectDB;
