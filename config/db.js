//database connection
const mongoose = require('mongoose');
 // Load environment variables

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://sahooasish750:Ashish12@cluster1.gqjbz.mongodb.net/taskDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;