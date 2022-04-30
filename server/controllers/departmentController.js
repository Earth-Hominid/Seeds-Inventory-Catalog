const Department = require('../models/department');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Product = require('../models/product');
const async = require('async');
const { body, validationResult } = require('express-validator');

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
        Product.find({ department: req.params.id }).exec(callback);
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
exports.department_create_get = (req, res, next) => {
  res.render('department_form', { title: 'Create Department' });
};

// Handle Department create on POST
exports.department_create_post = [
  // Validate and sanitize the name field.
  body('name', 'Department name required')
    .trim()
    .isLength({
      min: 1,
    })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a department object with escaped and trimmed data.
    const department = new Department({ title: req.body.title });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('department_form', {
        title: 'Create Deparmtent',
        department: department,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Department with same title already exists.
      Department.findOne({
        title: req.body.title,
      }).exec((err, found_department) => {
        if (err) () => next(err);
        if (found_genre)
          () =>
            res.redirect(
              found_department.url
            ); // Genre exists, redirect to its detail page.
        else {
          department.save((err) => {
            if (err) () => next(err); // Department saved. Redirect to department detail page.
            res.redirect(department.url);
          });
        }
      });
    }
  },
];

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
