const controller = require('../controllers/customer.controller');
const router = require('express').Router();

// Route to create a new customer
router.post('/', controller.createCustomer);

// Route to create multiple customers
router.post('/array', controller.createCustomers);

// Route to get all customers with pagination support
router.get('/pagination', controller.getAllCustomersPagination);

// Route to get all customers
router.get('/', controller.getAllCustomers);

// Route to get a customer by ID
router.get('/:id', controller.getCustomerById);

// Route to update a customer by ID
router.put('/:id', controller.updateCustomer);

// Route to delete a customer by ID
router.delete('/:id', controller.deleteCustomer);

module.exports = router;