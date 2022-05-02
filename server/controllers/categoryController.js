const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Product = require('../models/product');
const async = require('async');
const { body, validationResult } = require('express-validator');
const department = require('../models/department');

// Display list of all categories
exports.category_list = (req, res, next) => {
  Category.find()
    .sort([['name', 'ascending']])
    .exec((err, list_categories) => {
      if (err) {
        return next(err);
      }
      //Successful, thus return
      res.status(200).render('category_list', {
        title: 'Categories',
        category_list: list_categories,
      });
    });
};

// Display detail page for a specific category and the categories products.
exports.category_detail = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },

      category_products: function (callback) {
        Product.find({ category: req.params.id }).exec(callback);
      },

      category_subcategory: function (callback) {
        Subcategory.find({
          category: req.params.id,
        }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        let err = new Error('Category not found');
        err.status = 400;
        return next(err);
      }

      // Successful, so render
      res.status(200).render('category_detail', {
        title: 'Category Details',
        category: results.category,
        category_products: results.category_products,
        category_subcategory: results.category_subcategory,
      });
    }
  );
};

// Display category create form for GET request.
exports.category_create_get = (req, res, next) => {
  // Get all departments, in order to add it to the category.

  async.parallel(
    {
      departments: (callback) => {
        Department.find(callback);
      },
    },

    (err, results) => {
      if (err) () => next(err);
      res.render('category_form', {
        title: 'Create A Category',
        departments: results.departments,
      });
    }
  );
};

// Handle category create on POST
exports.category_create_post = (req, res, next) => [
  // Validate and sanitize fields.
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified.')
    .isAlphanumeric()
    .withMessage('Name has non-alphanumeric characters.'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('A description must be provided.'),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('category_form', {
        title: 'Create A Category',
        category: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Create a Category object with escaped and trimmed data.
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
      });

      category.save((err) => {
        if (err) () => next(err);
        // Successful, thus render.
        res.redirect(category.url);
      });
    }
  },
];

// Display category delete form on GET request.
exports.category_delete_get = (req, res) =>
  res.send('Not implemented yet: category delete GET');

// Display category delete on POST.
exports.category_delete_post = (req, res) =>
  res.send('Not implemented: category delete POST');

// Display category update form on GET request.
exports.category_update_get = (req, res) =>
  res.send('Not implemented: category update GET');

// Handle category update on POST.
exports.category_update_post = (req, res) =>
  res.send('Not implemented: category update POST');
