import mysql from "mysql2";

const connectDB = async () => {
  try {
    // Create a connection to the MySQL database
    const connection = mysql.createConnection({
      host: process.env.MYSQL_HOST, // MySQL host (e.g., 'localhost')
      user: process.env.MYSQL_USER, // MySQL username (e.g., 'root')
      password: process.env.MYSQL_PASSWORD, // MySQL password
      database: process.env.MYSQL_DATABASE, // MySQL database name
    });

    // Connect to the MySQL database
    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to the database:", err.stack);
        return;
      }
      console.log(`Database Connected: ${connection.threadId}`);
    });
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;