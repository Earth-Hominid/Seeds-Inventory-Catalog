const Product = require('../models/product');
const Department = require('../models/department');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const { body, validationResult } = require('express-validator');
const async = require('async');

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
        Subcategory.countDocuments({}, callback);
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
    .sort({ name: 1 })
    .populate('subcategory category department')
    .exec((err, results) => {
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
      product: (callback) => {
        Product.findById(req.params.id)
          .populate('subcategory')
          .populate('category')
          .populate('department')
          .exec(callback);
      },
      product_category: function (callback) {
        Category.find({ product: req.params.id }).exec(callback);
      },
      product_subcategory: (callback) => {
        Subcategory.find({ product: req.params.id }).exec(callback);
      },
      product_department: (callback) => {
        Department.find({ product: req.params.id }).exec(callback);
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
        name: results.product.name,
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
      departments: (callback) => {
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
  // Validate and sanitize fields.
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name needs to be specified.'),
  body('stockNumber')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Stock number needs to be specified.'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Description needs to be provided.'),
  body('packageSize')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('A size needs to be provided.'),

  // Process request after validation and sanitization

  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Product object with escaped and trimmed data.

    const product = new Product({
      name: req.body.name,
      department: req.body.department,
      category: req.body.category,
      subcategory: req.body.subcategory,
      description: req.body.description,
      stockNumber: req.body.stockNumber,
      price: req.body.price,
      packageSize: req.body.packageSize,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render('product_form', {
        title: 'Add a Product',
        product: product,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Product with same name already exists.
      Product.findOne({ name: req.body.name }).exec((err, found_product) => {
        if (err) () => next(err);
        if (found_product) () => res.redirect(found_product.url);
        else
          product.save((err) => {
            if (err) () => next(err);

            // Product saved. Redirect to product detail page.
            res.redirect(product.url);
          });
      });
    }
  },
];

// Display product delete form on GET request.
exports.product_delete_get = (req, res, next) => {
  async.parallel(
    {
      product: (callback) => {
        Product.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) () => next(err);
      if (results.product == null) {
        // No results.
        res.redirect('/catalog/products');
      }
      // Successful, thus render.
      res.status(200).render('product_delete', {
        title: 'Delete Product',
        product: results.product,
      });
    }
  );
};

// Display product delete on POST.
exports.product_delete_post = (req, res, next) => {
  async.parallel(
    {
      product: (callback) => {
        Product.findById(req.body.productid).exec(callback);
      },
    },
    (err, results) => {
      if (err) () => next(err);
      // No errors, delete object and redirect to product list.

      Product.findByIdAndRemove(
        req.body.productid,
        function deleteProduct(err) {
          if (err) () => next(err);
          // Success - go to product list.

          res.status(200).redirect('/catalog/products');
        }
      );
    }
  );
};

// Display product update form on GET request.
exports.product_update_get = (req, res) =>
  res.send('Not implemented: product update GET');

// Handle product update on POST.
exports.product_update_post = (req, res) =>
  res.send('Not implemented: product update POST');
