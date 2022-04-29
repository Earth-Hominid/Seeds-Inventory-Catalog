const Department = require('../models/department');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Product = require('../models/product');
const async = require('async');
const department = require('../models/department');

// Display all departments
exports.department_list = (req, res, next) => {
  Department.find({}, 'title')
    .populate()
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      //successful, thus return results
      res.status(200).render('department_list', {
        title: 'Departments',
        department_list: results,
      });
    });
};

// Dipslay detail page for a specific department:
exports.department_detail = (req, res, next) => {
  async.parallel(
    {
      department: (callback) => {
        Department.findById(req.params.id).exec(callback);
      },
      department_category: (callback) => {
        Category.find({ department: req.params.id }).exec(callback);
      },
      department_subcategory: (callback) => {
        Subcategory.find({ department: req.params.id }).exec(callback);
      },
      department_products: (callback) => {
        Department.find({ department: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.department == null) {
        let err = new Error('Department not found');
      }
      //success, thus render.
      res.status(200).render('department_detail', {
        title: 'Department Details',
        department: results.department,
        department_category: results.department_category,
        department_subcategory: results.department_subcategory,
        department_products: results.department_products,
      });
    }
  );
};

// Display department create form for GET request.
exports.department_create_get = (req, res) =>
  res.send('Not implemented yet: Department create GET');

// Handle Department create on POST
exports.department_create_post = (req, res) =>
  res.send('Not implemented yet: Department create POST');

// Display Department delete form on GET request.
exports.department_delete_get = (req, res) =>
  res.send('Not implemented yet: Department delete GET');

// Display Department delete on POST.
exports.department_delete_post = (req, res) =>
  res.send('Not implemented: Department delete POST');

// Display Department update form on GET request.
exports.department_update_get = (req, res) =>
  res.send('Not implemented: Department update GET');

// Handle Department update on POST.
exports.department_update_post = (req, res) =>
  res.send('Not implemented: Department update POST');
