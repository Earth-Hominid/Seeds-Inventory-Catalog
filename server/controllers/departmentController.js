const Department = require('../models/department');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Product = require('../models/product');
const async = require('async');
const { body, validationResult } = require('express-validator');
const fs = require('fs');

// Display all departments
exports.department_list = (req, res, next) => {
  Department.find({}, 'name')
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
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Department name required'),
  body('description').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a department object with escaped and trimmed data.
    const department = new Department({
      name: req.body.name,
      description: req.body.description,
      image: {
        data: req.file.filename,
        contentType: 'image/png',
      },
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('department_form', {
        title: 'Create Department',
        department: department,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Department with same name already exists.
      Department.findOne({
        name: req.body.name,
      }).exec((err, found_department) => {
        if (err) () => next(err);
        if (found_department) () => res.redirect(found_department.url);
        // Department exists, redirect to its detail page.
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
exports.department_delete_get = (req, res, next) => {
  async.parallel(
    {
      department: (callback) => {
        Department.findById(req.params.id).exec(callback);
      },
      department_products: (callback) => {
        Product.find({ department: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) () => next(err);
      if (results.department == null) {
        // No results.
        res.redirect('/catalog/depatments');
      }
      // Successful, thus render.
      res.status(200).render('department_delete', {
        title: 'Delete Department',
        department: results.department,
        department_products: results.department_products,
      });
    }
  );
};

// Display Department delete on POST.
exports.department_delete_post = (req, res, next) => {
  async.parallel(
    {
      department: (callback) => {
        Department.findById(req.body.departmentid).exec(callback);
      },
      department_products: (callback) => {
        Product.find({ department: req.body.departmentid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) () => next(err);
      // Success
      if (results.department_products.length > 0) {
        // Department has products, thus, render the same as the GET route.

        res.render('department_delete', {
          title: 'Delete Department',
          department: results.department,
          department_products: results.department_products,
        });
        return;
      } else {
        // Department has no products. Delete object and redirect to department list.

        Department.findByIdAndRemove(
          req.body.departmentid,
          function deleteDepartment(err) {
            if (err) () => next(err);
            // Success - got to department list.

            res.status(200).redirect('/catalog/departments');
          }
        );
      }
    }
  );
};

// Display Department update form on GET request.
exports.department_update_get = (req, res, next) => {
  // Get department info. for form.

  async.parallel(
    {
      department: (callback) => {
        Department.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) () => next(err);
      if (results.department == null) {
        // No results.
        let err = new Error('Department not found');
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render('department_form', {
        title: 'Update Department',
        department: results.department,
      });
    }
  );
};

// Handle Department update on POST.
exports.department_update_post = [
  // Validate and sanitize the name field.
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Department name required'),
  body('description').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a department object with escaped and trimmed data.
    const department = new Department({
      name: req.body.name,
      description: req.body.description,
      image: {
        data: req.file.filename,
        contentType: 'image/png',
      },
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('department_form', {
        title: 'Create Department',
        department: department,
        errors: errors.array(),
      });
      return;
    } else {
      Department.findByIdAndUpdate(
        req.params.id,
        department,
        {},
        function (err, thedepartment) {
          if (err) () => next(err);
          // Successful, redirect to department detail page.
          res.redirect(thedepartment.url);
        }
      );
    }
  },
];
