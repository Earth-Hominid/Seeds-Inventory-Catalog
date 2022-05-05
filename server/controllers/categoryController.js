const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Product = require('../models/product');
const async = require('async');
const { body, validationResult } = require('express-validator');
const Department = require('../models/department');

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
        title: 'Create a Category',
        departments: results.departments,
      });
    }
  );
};

// Handle category create on POST
exports.category_create_post = [
  // Validate and sanitize fields.
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified.'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('A description must be provided.'),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      department: req.body.department,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('category_form', {
        title: 'Create a Category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      //Check if Category with same name already exists.
      Category.findOne({ name: req.body.name }).exec((err, found_category) => {
        if (err) () => next(err);
        if (found_category) () => res.redirect(found_category.url);
        else
          category.save((err) => {
            if (err) () => next(err);

            // Category saved. Redirect to category detail page.
            res.redirect(category.url);
          });
      });
    }
  },
];

// Display category delete form on GET request.
exports.category_delete_get = (req, res, next) => {
  async.parallel(
    {
      category: (callback) => {
        Category.findById(req.params.id).exec(callback);
      },
      category_products: (callback) => {
        Product.find({ category: req.params.id }).exec(callback);
      },
      category_subcategories: (callback) => {
        Subcategory.find({ subcategory: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) () => next(err);
      if (results.category == null) {
        // No results.
        res.redirect('/catalog/categories');
      }
      // Successful, thus render.
      res.render('category_delete', {
        title: 'Delete Category',
        category: results.category,
        category_products: results.category_products,
        category_subcategories: results.category_subcategories,
      });
    }
  );
};

// Display category delete on POST.
exports.category_delete_post = (req, res, next) => {
  async.parallel(
    {
      category: (callback) => {
        Category.findById(req.body.categoryid).exec(callback);
      },
      category_products: (callback) => {
        Product.find({ category: req.body.categoryid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) () => next(err);
      // Success
      if (
        results.category_products.length > 0 &&
        results.category_subcategories.length > 0
      ) {
        // Category has products. Render in same way as for GET route.
        res.render('category_delete', {
          title: 'Delete Category',
          category: results.category,
          category_products: results.category_products,
          category,
        });
        return;
      } else {
        // Category has no products. Delete object and redirect to the category list.

        Category.findByIdAndRemove(
          req.body.categoryid,
          function deleteCategory(err) {
            if (err) () => next(err);
            // Success - got to catgory list

            res.redirect('/catalog/categories');
          }
        );
      }
    }
  );
};

// Display category update form on GET request.
exports.category_update_get = (req, res) =>
  res.send('Not implemented: category update GET');

// Handle category update on POST.
exports.category_update_post = (req, res) =>
  res.send('Not implemented: category update POST');
