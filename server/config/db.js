const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Database is connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database Connection Error', error);
    process.exit(1); // exit the process with failure
  }
};

module.exports = connectDB;
