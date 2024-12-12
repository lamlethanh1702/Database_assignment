import { Sequelize, DataTypes } from "sequelize";

// Initialize Sequelize with your MySQL connection details
const sequelize = new Sequelize("bookstore1", "root", "123456", {
  host: "localhost",
  dialect: "mysql", // or 'mariadb'
});

// Define the Post model
const Post = sequelize.define(
  "book",
  {
    BookID: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
      primaryKey: true,
    },
    link_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Quantity_remain: {
      type: DataTypes.INTEGER, // Integer type for numbers
      allowNull: false,
    },
    Book_Price: {
      type: DataTypes.FLOAT, // Float type for decimal numbers
      allowNull: false,
    },
    CategoryID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PublisherID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    WID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "book", // Explicitly specify the table name
    timestamps: false, // Disable Sequelize's automatic `createdAt` and `updatedAt` fields
  }
);

const member = sequelize.define(
  "member",
  {
    MemberID: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
    },
    Member_Name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Member_Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Member_Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Member_ContactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "member", // Explicitly specify the table name
    timestamps: false, // Disable Sequelize's automatic `createdAt` and `updatedAt` fields
  }
);

const publisher = sequelize.define(
  "publisher",
  {
    PublisherID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Pub_Name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Pub_ContactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Pub_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Pub_Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "publisher", // Explicitly specify the table name
    timestamps: false, // Disable Sequelize's automatic `createdAt` and `updatedAt` fields
  }
);

const manager = sequelize.define(
  "manager",
  {
    ManagerID: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
    },
    Manager_Name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Manager_ContactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "manager", // Explicitly specify the table name
    timestamps: false, // Disable Sequelize's automatic `createdAt` and `updatedAt` fields
  }
);

const Category = sequelize.define(
  "category",
  {
    CategoryID: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
      primaryKey: true,
    },
    Category_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "category", // Explicitly specify the table name
    timestamps: false, // Disable Sequelize's automatic `createdAt` and `updatedAt` fields
  }
);

const orders = sequelize.define("orders", 
  {
    OrderID: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
      primaryKey: true,
    },
    Order_date: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
    Total_Price: {
      type: DataTypes.FLOAT, // Float type for decimal numbers
      allowNull: false,
    },
    MemberID: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
    ManagerID: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
  }
);

const containbooks = sequelize.define(
  "containbooks",
  {
    BookID: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
      primaryKey: true,
    },
    Book_Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    OrderID: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
  },
  {
    tableName: "containbooks", // Explicitly specify the table name
    timestamps: false, // Disable Sequelize's automatic `createdAt` and `updatedAt` fields
  }
);

const feedback = sequelize.define(
  "feedback",
  {
    FeedbackID: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
      primaryKey: true,
    },
    Stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Comments: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
    BookID: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
    MemberID: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
  },
  {
    tableName: "feedback", // Explicitly specify the table name
    timestamps: false, // Disable Sequelize's automatic `createdAt` and `updatedAt` fields
  }
);

const rate = sequelize.define(
  "rate",
  {
    FeedbackID: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
      primaryKey: true,
    },
    BookID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "rate", // Explicitly specify the table name
    timestamps: false, // Disable Sequelize's automatic `createdAt` and `updatedAt` fields
  }
);

const searching = sequelize.define(
  "search",
  {
    MemberID: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
    BookID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "search", // Explicitly specify the table name
    timestamps: false, // Disable Sequelize's automatic `createdAt` and `updatedAt` fields
  }
);

const warehouse = sequelize.define(
  "warehouse",
  {
    WID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    Warehouse_Address: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
    ManagerID: {
      type: DataTypes.STRING,
      allowNull: false, // Required
    },
  },
  {
    tableName: "warehouse", // Explicitly specify the table name
    timestamps: false, // Disable Sequelize's automatic `createdAt` and `updatedAt` fields
  }
);

// Sync the model with the database
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sync the schema to the database (creates the table if it doesn't exist)
    await Post.sync();
    console.log("Post table has been created.");
    await member.sync();
    console.log("User table has been created");
    await feedback.sync();
    console.log("Feedback table has been created");
    await publisher.sync();
    console.log("publisher table has been created");
    await manager.sync();
    console.log("manager table has been created");
    await Category.sync();
    console.log("Category table has been created");
    await containbooks.sync();
    console.log("containbooks table has been created");
    await rate.sync();
    console.log("rate table has been created");
    await warehouse.sync();
    console.log("warehouse table has been created");
    await searching.sync();
    console.log("searhing table has been created");
    await orders.sync();
    console.log("orders table has been created");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export { Post, member, feedback, manager, publisher, Category, containbooks, rate, warehouse, searching, orders };
