const Product = require('../models/product');
const Department = require('../models/department');
const Category = require('../models/category');
const SubCategory = require('../models/subcategory');
const { body, validationResult } = require('express-validator');
const async = require('async');
const subcategory = require('../models/subcategory');

exports.index = (req, res) => {
  async.parallel(
    {
      product_count: function (callback) {
        Product.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      department_count: function (callback) {
        Department.countDocuments({}, callback);
      },
      category_count: function (callback) {
        Category.countDocuments({}, callback);
      },
      subcategory_count: function (callback) {
        SubCategory.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render('index', { title: 'Seeds | Home', error: err, data: results });
    }
  );
};

// Display list of all products
exports.product_list = (req, res, next) => {
  Product.find({}, 'name')
    .sort({ subcategory: 1 })
    .populate('subcategory category department')
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      // successful, thus return results
      res.status(200).render('product_list', {
        title: 'Product List',
        product_list: results,
      });
    });
};

// Display detail page for a specific product:
exports.product_detail = (req, res, next) => {
  async.parallel(
    {
      product: function (callback) {
        Product.findById(req.params.id)
          .populate('subcategory category department')
          .exec(callback);
      },

      product_category: function (callback) {
        Category.find({ product: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.product == null) {
        // No results.
        var err = new Error('Product not found');
        err.status = 404;
        return next(err);
      }
      // Successful, thus render.
      res.render('product_detail', {
        title: 'Product Details',
        product: results.product,
        product_cateogry: results.product_category,
        product_subcategory: results.category_subcategory,
      });
    }
  );
};

// Display product create form for GET request.
exports.product_create_get = (req, res, next) => {
  // Get all categories, subcategories and departments, which we can use for adding to the product.

  async.parallel(
    {
      categories: (callback) => {
        Category.find(callback);
      },
      subcategories: (callback) => {
        Subcategory.find(callback);
      },
      departments: (callbcack) => {
        Department.find(callback);
      },
    },

    (err, results) => {
      if (err) () => next(err);
      res.render('product_form', {
        title: 'Add Product',
        categories: results.categories,
        subcategories: results.subcategories,
        departments: results.departments,
      });
    }
  );
};

// Handle product create on POST
exports.product_create_post = (req, res) =>
  res.send('Not implemented yet: product create POST');

// Display product delete form on GET request.
exports.product_delete_get = (req, res) =>
  res.send('Not implemented yet: product delete GET');

// Display product delete on POST.
exports.product_delete_post = (req, res) =>
  res.send('Not implemented: product delete POST');

// Display product update form on GET request.
exports.product_update_get = (req, res) =>
  res.send('Not implemented: product update GET');

// Handle product update on POST.
exports.product_update_post = (req, res) =>
  res.send('Not implemented: product update POST');
