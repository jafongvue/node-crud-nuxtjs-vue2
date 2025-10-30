# Node API Project

This project is a basic Node.js API that includes user authentication and category management using Express.js, Sequelize, and MySQL.

## Getting Started

These instructions will help you set up the project on your local machine.

### Prerequisites

- Node.js and npm
- MySQL

### Installing

1. If clone the repository not do the next step, if not clone do step by step:

   ```sh
   git clone https://github.com/Sengkue/node-example-crud02.git
   cd node-example-crud02
   ```
   ```sh
   mkdir node-example-crud
   cd node-example-crud
   npm init
   ```

2. Install the required npm packages:

   ```sh
   npm install express body-parser cors nodemon dotenv bcrypt mysql2 sequelize
   ```

3. Create a `.env` file in the root directory and add your database configuration:

   ```sh
   DB_NAME='parentsShop'
   USER='root'
   PASSWORD=''
   PORT='8080'
   SECRET_KEY=1181
   ```

4. Create a `.gitignore` file in the root directory:
   ```sh
   .env
   node_modules
   package-lock.json
   ```
5. update code in `package.json` like this:
   ```sh
   "scripts": {
   "test": "test",
   "start":"nodemon server.js"
   },
   ```

### Running the Server

1. To start the server, run:
   ```sh
   npm start
   ```
   The server will run on the port specified in the `.env` file (default: 8080).

## Project Structure

- `server.js`: Main entry point of the application.
- `config/db.js`: Database configuration and connection using Sequelize.
- `models/`: The directory contains the definition of the database models.
- `controllers/`: directory contains the logic for handling requests and responses
- `router/router.js`: Main router file.
- `router/category.routes.js`: child routes.

# Code

## server.js

```javascript
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./config/db");
const routes = require("./router/router");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.get("/", (req, res) => {
  return res.json("welcome to node api");
});

app.post("/api", (req, res) => {
  console.log(req.body);
  res.send("Hello world!");
});

const port_A = 8000;
const port = process.env.PORT || port_A;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

## config/db.js

```javascript
const Sequelize = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.USER,
  process.env.PASSWORD,
  {
    dialect: "mysql",
    host: process.env.HOST,
    dialectOptions: {},
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

sequelize.sync().then(() => {
  console.log("Database & tables created!");
});

module.exports = sequelize;
```

# models

## models/category.model.js

```javascript
const DataTypes = require("sequelize");
const sequelize = require("../config/db");
const Category = sequelize.define(
  "categories",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = Category;
```

## models/employee.model.js

```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Employee = sequelize.define(
  "employee",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = Employee;
```

# router

## router/router.js

```javascript
const route = require("express").Router();

const category = require("./category.routes");
const employee = require("./employee.routes");

route.use("/category", category);
route.use("/employee", employee);

module.exports = route;
```

## router/category.routes.js

```javascript
const controller = require("../controllers/category.controller");
const route = require("express").Router();
route.post("/", controller.create);
route.get("/", controller.findAll);
route.get("/:id", controller.findOne);
route.put("/:id", controller.update);
route.delete("/:id", controller.delete);

module.exports = route;
```

## router/employee.routes.js

```javascript
const controller = require("../controllers/employee.controller");
const router = require("express").Router();

// Route to create a new employee
router.post("/", controller.createEmployee);

// Route to create a new employee
router.post("/array", controller.createEmployees);

// Route to get all employees
router.get("/", controller.getAllEmployees);

// Route to get an employee by ID
router.get("/:id", controller.getEmployeeById);

// Route to update an employee by ID
router.put("/:id", controller.updateEmployee);

// Route to delete an employee by ID
router.delete("/:id", controller.deleteEmployee);

module.exports = router;
```

# controllers

## controllers/category.controller.js

```javascript
const Category = require("../models/category.model");
exports.create = (req, res) => {
  const category = {
    category: req.body.category,
  };
  Category.create(category)
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(200).json({ result: error });
    });
};
exports.findAll = (req, res) => {
  Category.findAndCountAll()
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(500).json({ result: error });
    });
};
exports.findOne = (req, res) => {
  const id = req.params.id;
  Category.findOne({ where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(500).json({ result: error });
    });
};
exports.update = (req, res) => {
  const id = req.params.id;
  const category = {
    category: req.body.category,
  };
  Category.update(category, { where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(200).json({ result: error });
    });
};
exports.delete = (req, res) => {
  const id = req.params.id;
  Category.destroy({ where: { id: id } })
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(500).json({ result: error });
    });
};
```

## controller/employee.controller.js

```javascript
const Employee = require("../models/employee.model");
const sequelize = require("../config/db");
const { QueryTypes, Op } = require("sequelize");

// Create multiple employees
exports.createEmployees = async (req, res) => {
  const employeesData = req.body; // Array of employees data

  try {
    // Create employees
    const createdEmployees = await Employee.bulkCreate(employeesData);

    res.status(201).json({
      message: "Employees created successfully",
      employees: createdEmployees,
    });
  } catch (error) {
    console.error("Error creating employees:", error);
    res.status(500).json({ message: "Error creating employees", error });
  }
};

// Create a new employee using Sequelize ORM
exports.createEmployee = async (req, res) => {
  const { id, email, first_name, last_name, avatar } = req.body;

  try {
    // Check if an employee with the same id or email already exists
    const existingEmployee = await Employee.findOne({
      where: {
        [Op.or]: [
          // { id: id },
          { email: email },
        ],
      },
    });

    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with the same id or email already exists" });
    }

    // Create new employee
    const newEmployee = await Employee.create({
      id,
      email,
      first_name,
      last_name,
      avatar,
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating employee", error });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await sequelize.query("SELECT * FROM employees", {
      type: QueryTypes.SELECT,
    });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await sequelize.query(
      "SELECT * FROM employees WHERE id = ?",
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );

    if (employee.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { email, first_name, last_name, avatar } = req.body;

  try {
    const result = await sequelize.query(
      `UPDATE employees 
       SET email = ?, first_name = ?, last_name = ?, avatar = ?, updatedAt = NOW()
       WHERE id = ?`,
      {
        replacements: [email, first_name, last_name, avatar, id],
        type: QueryTypes.UPDATE,
      }
    );

    // Check if the update affected any rows
    if (result[1] === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Fetch the updated employee after successful update
    const updatedEmployee = await sequelize.query(
      "SELECT * FROM employees WHERE id = ?",
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await sequelize.query(
      "SELECT * FROM employees WHERE id = ?",
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );

    if (employee.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await sequelize.query("DELETE FROM employees WHERE id = :id", {
      replacements: { id },
      type: QueryTypes.DELETE,
    });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Error deleting employee", error });
  }
};
```

# Postmans API

## api category:

```sh
 post:   https://localhost:8080/category
 get:    https://localhost:8080/category
 get:    https://localhost:8080/category/123
 put:    https://localhost:8080/category/123
 delete: https://localhost:8080/category/123
```

## api employee:

```sh
post:   https://localhost:8080/employee
post:   https://localhost:8080/employee/array
get:    https://localhost:8080/employee
get:    https://localhost:8080/employee/123
put:    https://localhost:8080/employee/123
delete: https://localhost:8080/employee/123
```
```sh 
{
    "id": "123",
    "email": "sengkuevangdd@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "avatar": "http://example.com/avatar.jpg"
}

```

### Authors

- **Your Name** - _Initial work_ - [YourGitHub](https://github.com/your-username)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
#   n o d e - c r u d - n u x t j s - v u e 2  
 #   n o d e - c r u d - n u x t j s - v u e 2  
 