//creating widgetRoutes

const express = require('express');
const widgetRouter = express.Router();

/* importing the controllers */
const { widgetChat } = require('../controllers/widgetController');

/* widget integration route */
widgetRouter.post('/chat', widgetChat);

module.exports = { widgetRouter };
