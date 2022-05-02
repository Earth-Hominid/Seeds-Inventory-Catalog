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
exports.product_create_post = [
  // Convert the category to an array.
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  // Validate and sanitize fields.
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name needs to be specified.')
    .isAlphanumeric()
    .withMessage('Name has non-alphanumeric characters.'),
  body('stockNumber')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Stock number needs to be specified.')
    .isAlphanumeric()
    .withMessage('Stock number has non-alphanumeric characters.'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Description needs to be provided.')
    .isAlphanumeric()
    .withMessage('Description has non-alphnumeric characters.'),
  body('packageSize')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('A size needs to be provided.')
    .isAlphanumeric()
    .withMessage('Package size has non-alphanumeric characters.'),
  body('seedsPerGram')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('A seeds per gram value needs to be provided.')
    .isAlphanumeric()
    .withMessage('Seeds per gram value has non-alphanumeric characters.'),
  body('category.*').escape(),
  body('subcategory.*').escape(),
  body('department.*'),

  // Process request after validation and sanitization

  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Product object with escaped and trimmed data.

    const product = new Product({
      name: req.body.name,
      stockNumber: req.body.stockNumber,
      description: req.body.description,
      price: req.body.price,
      packageSize: req.body.packageSize,
      seedsPerGram: req.body.seedsPerGram,
      quantity: req.body.quantity,
      category: req.body.category,
      subcategory: req.body.subcategory,
      department: req.body.department,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all category, subcategory, department for form.

      async.parallel(
        {
          department: (callback) => Department.find(callback),
          category: (callback) => Category.find(callback),
          subcategory: (callback) => Subcategory.find(callback),
        },
        (err, results) => {
          if (err) () => next(err);

          // Mark our selected category, sub-category and department as checked.
          for (let i = 0; i < results.category.length; i++) {
            if (product.category.indexOf(results.categories[i]._id) > -1) {
              results.categories[i].checked = 'true';
            }
          }
          for (let i = 0; i < results.subcategory.length; i++) {
            if (
              product.subcategory.indexOf(results.subcategories[i]._id) > -1
            ) {
              results.subcategories[i].checked = 'true';
            }
          }
          for (let i = 0; i < results.department.length; i++) {
            if (product.department.indexOf(results.departments[i]._id) > -1) {
              results.departments[i].checked = 'true';
            }
          }

          res.render('product_form', {
            title: 'Add A Product',
            category: results.categories,
            subcategory: results.subcategories,
            department: results.departments,
            product: product,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Save Product.
      product.save((err) => {
        if (err) () => next(err);
        //successful - redirect to new product record.

        res.redirect(product.url);
      });
    }
  },
];

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
