const express = require('express');

const RuleController = require('./controllers/RuleController');

const routes = express.Router();

routes.post('/api/rules', RuleController.create);
routes.delete('/api/rules', RuleController.delete);
routes.get('/api/rules', RuleController.index);
routes.get('/api/rules/available', RuleController.available);


module.exports = routes;