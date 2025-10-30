const Customer = require("../models/customer.model");
const sequelize = require("../config/db");
const { QueryTypes, Op } = require("sequelize");

// Create a new customer
exports.createCustomer = async (req, res) => {
  const { email, first_name, last_name, phone, address, city, country, postal_code, date_of_birth, is_active } = req.body;

  try {
    // Check if customer with same email already exists
    const existingCustomer = await Customer.findOne({
      where: { email: email }
    });

    if (existingCustomer) {
      return res.status(400).json({ 
        message: "Customer with this email already exists" 
      });
    }

    // Create new customer
    const newCustomer = await Customer.create({
      email,
      first_name,
      last_name,
      phone,
      address,
      city,
      country,
      postal_code,
      date_of_birth,
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ 
      message: "Error creating customer", 
      error: error.message 
    });
  }
};

// Create multiple customers
exports.createCustomers = async (req, res) => {
  const customersData = req.body; // Array of customers data

  try {
    // Validate if all required fields are present
    for (let customer of customersData) {
      if (!customer.email || !customer.first_name || !customer.last_name) {
        return res.status(400).json({ 
          message: "All customers must have email, first_name, and last_name" 
        });
      }
    }

    // Create customers
    const createdCustomers = await Customer.bulkCreate(customersData, {
      validate: true
    });

    res.status(201).json({
      message: "Customers created successfully",
      customers: createdCustomers,
    });
  } catch (error) {
    console.error("Error creating customers:", error);
    res.status(500).json({ 
      message: "Error creating customers", 
      error: error.message 
    });
  }
};

// Get all customers with pagination
exports.getAllCustomersPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  let perPage = parseInt(req.query.per_page) || 6;
  const search = req.query.search || '';

  try {
    // Build where condition for search
    let whereCondition = {};
    if (search) {
      whereCondition = {
        [Op.or]: [
          { first_name: { [Op.like]: `%${search}%` } },
          { last_name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    // Count total number of customers
    const totalCount = await Customer.count({ 
      where: whereCondition 
    });
    const total = totalCount;

    if (perPage <= 0) {
      perPage = total;
    }

    const totalPages = Math.ceil(total / perPage);
    const offset = (page - 1) * perPage;

    // Fetch customers for the current page
    const customers = await Customer.findAll({
      where: whereCondition,
      limit: perPage,
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    // Construct response data
    const responseData = {
      page,
      per_page: perPage,
      total,
      total_pages: totalPages,
      data: customers,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ 
      message: "Error fetching customers", 
      error: error.message 
    });
  }
};

// Get all customers (without pagination)
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ 
      message: "Error fetching customers", 
      error: error.message 
    });
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ 
      message: "Error fetching customer", 
      error: error.message 
    });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { email, first_name, last_name, phone, address, city, country, postal_code, date_of_birth, is_active } = req.body;

  try {
    // Find customer
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== customer.email) {
      const existingCustomer = await Customer.findOne({ 
        where: { email: email } 
      });
      if (existingCustomer) {
        return res.status(400).json({ 
          message: "Customer with this email already exists" 
        });
      }
    }

    // Update customer
    await customer.update({
      email: email || customer.email,
      first_name: first_name || customer.first_name,
      last_name: last_name || customer.last_name,
      phone: phone !== undefined ? phone : customer.phone,
      address: address !== undefined ? address : customer.address,
      city: city !== undefined ? city : customer.city,
      country: country !== undefined ? country : customer.country,
      postal_code: postal_code !== undefined ? postal_code : customer.postal_code,
      date_of_birth: date_of_birth !== undefined ? date_of_birth : customer.date_of_birth,
      is_active: is_active !== undefined ? is_active : customer.is_active
    });

    // Fetch updated customer
    const updatedCustomer = await Customer.findByPk(id);

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ 
      message: "Error updating customer", 
      error: error.message 
    });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.destroy();

    res.status(200).json({ 
      message: "Customer deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ 
      message: "Error deleting customer", 
      error: error.message 
    });
  }
};