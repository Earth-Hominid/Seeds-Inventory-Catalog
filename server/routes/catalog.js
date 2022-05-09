const express = require('express');
const router = express.Router();

// Require controller modules
const product_controller = require('../controllers/productController');
const department_controller = require('../controllers/departmentController');
const category_controller = require('../controllers/categoryController');
const subcategory_controller = require('../controllers/subcategoryController');

// Product Routes

// GET catalog home page.
router.get('/', product_controller.index);

// GET request for creating a Product. Note: this needs to come before routers that dispaly Product as they use the Produc id.
router.get('/product/create', product_controller.product_create_get);

// POST request to create a Product.
router.post('/product/create', product_controller.product_create_post);

// GET request to delete a Product.
router.get('/product/:id/delete', product_controller.product_delete_get);

// POST request to delete a Product.
router.post('/product/:id/delete', product_controller.product_delete_post);

// GET request to update a Product.
router.get('/product/:id/update', product_controller.product_update_get);

// POST request to update Product.
router.post('/product/:id/update', product_controller.product_update_post);

// GET request for one Product.
router.get('/product/:id/', product_controller.product_detail);

//POST request for list of products.
router.get('/products/', product_controller.product_list);

// Department Routes

// GET request for creating a Department. Note: this must come before route for id (ie. display department).

router.get('/department/create', department_controller.department_create_get);

// POST request for creating department.
router.post('/department/create', department_controller.department_create_post);

// GET request to delete department.
router.get(
  '/department/:id/delete',
  department_controller.department_delete_get
);

// POST request to delete department.
router.post(
  '/department/:id/delete',
  department_controller.department_delete_post
);

// GET request to update department.
router.get(
  '/department/:id/update',
  department_controller.department_update_get
);

// POST request to update department.
router.post(
  '/department/:id/update',
  department_controller.department_update_post
);

// GET request for one department.
router.get('/department/:id', department_controller.department_detail);

// GET request for list of all departments.
router.get('/departments', department_controller.department_list);

// Category Routes

// GET request for creating a Category. NOTE This must come before route that displays Catgory (uses id).
router.get('/category/create', category_controller.category_create_get);

//POST request for creating category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update category.
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all category.
router.get('/categories', category_controller.category_list);

// Subcategory Routes

// GET request for creating a Subcategory. NOTE This must come before route that displays Subcategory (uses id).
router.get(
  '/subcategory/create',
  subcategory_controller.subcategory_create_get
);

//POST request for creating subcategory.
router.post(
  '/subcategory/create',
  subcategory_controller.subcategory_create_post
);

// GET request to delete subcategory.
router.get(
  '/subcategory/:id/delete',
  subcategory_controller.subcategory_delete_get
);

// POST request to delete subcategory.
router.post(
  '/subcategory/:id/delete',
  subcategory_controller.subcategory_delete_post
);

// GET request to update subcategory.
router.get(
  '/subcategory/:id/update',
  subcategory_controller.subcategory_update_get
);

// POST request to update subcategory.
router.post(
  '/subcategory/:id/update',
  subcategory_controller.subcategory_update_post
);

// GET request for one subcategory.
router.get('/subcategory/:id', subcategory_controller.subcategory_detail);

// GET request for list of all subcategory.
router.get('/subcategories', subcategory_controller.subcategory_list);

module.exports = router;
