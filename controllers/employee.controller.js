const Employee = require("../models/employee.model");
const sequelize = require("../config/db");
const { QueryTypes, Op } = require("sequelize");

// // Get all employees with pagination
// exports.getAllEmployeesPagination = async (req, res) => {
//   const page = parseInt(req.query.page) || 1; // Current page number, default is 1
//   const perPage = parseInt(req.query.per_page) || 6; // Number of employees per page, default is 6

//   try {
//     // Count total number of employees
//     const totalCount = await Employee.count(); // Using Sequelize count method
//     const total = totalCount;
//     const totalPages = Math.ceil(total / perPage); // Calculate total pages

//     // Calculate offset for pagination
//     const offset = (page - 1) * perPage;

//     // Fetch employees for the current page
//     const employees = await Employee.findAll({
//       limit: perPage,
//       offset: offset,
//       attributes: ["id", "email", "first_name", "last_name", "avatar"], // Select specific columns
//     });

//     // Construct the response data
//     const responseData = {
//       page,
//       per_page: perPage,
//       total,
//       total_pages: totalPages,
//       data: employees,
//     };

//     res.status(200).json(responseData);
//   } catch (error) {
//     console.error("Error fetching employees:", error);
//     res.status(500).json({ message: "Error fetching employees", error });
//   }
// };
// Get all employees with pagination
exports.getAllEmployeesPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number, default is 1
  let perPage = parseInt(req.query.per_page) || 6; // Number of employees per page, default is 6

  try {
    // Count total number of employees
    const totalCount = await Employee.count(); // Using Sequelize count method
    const total = totalCount;

    if (perPage <= 0) {
      perPage = total; // Set perPage to total number of employees if perPage is <= 0
    }

    const totalPages = Math.ceil(total / perPage); // Calculate total pages

    // Calculate offset for pagination
    const offset = (page - 1) * perPage;

    // Fetch employees for the current page
    const employees = await Employee.findAll({
      limit: perPage,
      offset: offset,
      attributes: ["id", "email", "first_name", "last_name", "avatar"], // Select specific columns
    });

    // Construct the response data
    const responseData = {
      page,
      per_page: perPage,
      total,
      total_pages: totalPages,
      data: employees,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Error fetching employees", error });
  }
};


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
