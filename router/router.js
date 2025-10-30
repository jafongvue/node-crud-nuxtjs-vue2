const route = require('express').Router();

const employee = require('./employee.routes');
const customers = require('./customer.routes');

route.use('/employee', employee);
route.use('/customer', customers)

module.exports = route;