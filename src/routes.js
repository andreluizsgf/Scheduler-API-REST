const express = require('express');

const RuleController = require('./controllers/RuleController');

const routes = express.Router();

routes.post('/create', RuleController.create);



module.exports = routes;