const Product = require('../models/product');
const Department = require('../models/department');
const Category = require('../models/category');
const SubCategory = require('../models/subcategory');

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
        SubCategory.countDocuments({}, callback);
      },
    },
    function (err, results) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(results);
      }
    }
  );
};

// Display list of all products
exports.product_list = (req, res, next) => {
  Product.find({}, 'name category subcategory')
    .sort({ name: 1 })
    .populate('category subcategory')
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      // successful, thus return results
      res.status(200).json(results);
    });
};

// Display detail page for a specific product:
exports.product_detail = (req, res, next) => {
  Product.findById(req.params.id)
    .populate('department category subcategory')
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      //Success, thus render:
      res.status(200).json(results);
    });
};

// Display product create form for GET request.
exports.product_create_get = (req, res) =>
  res.send('Not implemented yet: product create GET');

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
