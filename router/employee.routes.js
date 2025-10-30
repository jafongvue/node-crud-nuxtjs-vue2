const controller = require('../controllers/employee.controller');
const router = require('express').Router();

// Route to create a new employee
router.post('/', controller.createEmployee);

// Route to create a new employee
router.post('/array', controller.createEmployees);

// Route to get all employees with pagination support
router.get('/pagination', controller.getAllEmployeesPagination);

// Route to get all employees
router.get('/', controller.getAllEmployees);

// Route to get an employee by ID
router.get('/:id', controller.getEmployeeById);

// Route to update an employee by ID
router.put('/:id', controller.updateEmployee);

// Route to delete an employee by ID
router.delete('/:id', controller.deleteEmployee);

module.exports = router;
