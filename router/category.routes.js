const controller = require('../controllers/category.controller');
const route = require('express').Router();
route.post('/', controller.create);
route.get('/', controller.findAll);
route.get('/:id', controller.findOne);
route.put('/:id', controller.update);
route.delete('/:id', controller.delete);

module.exports = route;