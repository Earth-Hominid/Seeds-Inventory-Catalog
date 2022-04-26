const express = require('express');
const router = express.Router();

// Require controller modules
const product_controller = require('../controllers/productController');
const department_controller = require('../controllers/departmentController');
const category_controller = require('../controllers/categoryController');
const subcategory_controller = require('../controllers/subcategoryController');
