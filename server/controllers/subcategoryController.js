const Subcategory = require('../models/subcategory');
const Category = require('../models/category');
const Product = require('../models/product');
const Department = require('../models/department');
const async = require('async');
const { body, validationResult } = require('express-validator');

// Display list of all subcategories
exports.subcategory_list = (req, res, next) => {
  Subcategory.find()
    .sort([['name', 'ascending']])
    .exec((err, list_subcategories) => {
      if (err) {
        return next(err);
      }
      //Successful, thus return
      res.status(200).render('subcategory_list', {
        title: 'Sub-categories',
        subcategory_list: list_subcategories,
      });
    });
};

// Display detail page for a specific subcategory:
exports.subcategory_detail = (req, res, next) => {
  async.parallel(
    {
      subcategory: (callback) => {
        Subcategory.findById(req.params.id).exec(callback);
      },
      subcategory_products: (callback) => {
        Product.find({ subcategory: req.params.id }).exec(callback);
      },
      subcategory_category: (callback) => {
        Category.find({
          subcategory: req.params.id,
        }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.subcategory == null) {
        let err = new Error('Subcategory was not found');
        err.status = 400;
        return next(err);
      }
      //Successful, thus render.
      res.status(200).render('subcategory_detail', {
        title: 'Sub-Category Details',
        subcategory: results.subcategory,
        subcategory_products: results.subcategory_products,
        subcategory_category: results.subcategory_category,
      });
    }
  );
};

// Display subcategory create form for GET request.
exports.subcategory_create_get = (req, res, next) => {
  // Get all departments and categories, in order to add them to the subcategory.

  async.parallel(
    {
      departments: (callback) => {
        Department.find(callback);
      },
      categories: (callback) => {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) () => next(err);
      res.render('subcategory_form', {
        title: 'Create a Sub-Category',
        departments: results.departments,
        categories: results.categories,
      });
    }
  );
};

// Handle subcategory create on POST
exports.subcategory_create_post = [
  //Validate and sanitize fields.
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

    // Create a sub-category object with escaped and trimmed data.
    const subcategory = new Subcategory({
      name: req.body.name,
      description: req.body.description,
      department: req.body.department,
      category: req.body.category,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('subcategory_form', {
        title: 'Create a Sub-Category',
        subcategory: subcategory,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      //Check if Sub-category with same name already exists.
      Subcategory.findOne({ name: req.body.name }).exec(
        (err, found_subcategory) => {
          if (err) () => next(err);
          if (found_subcategory) () => res.redirect(found_subcategory.url);
          else
            subcategory.save((err) => {
              if (err) () => next(err);

              // Category saved. Redirect to sub-category detail page.
              res.redirect(subcategory.url);
            });
        }
      );
    }
  },
];

// Display subcategory delete form on GET request.
exports.subcategory_delete_get = (req, res) => {
  async.parallel(
    {
      subcategory: (callback) => {
        Subcategory.findById(req.params.id).exec(callback);
      },
      subcategory_products: (callback) => {
        Product.find({ subcategory: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) () => next(err);
      if (results.subcategory == null) {
        // No results.
        res.redirect('/catalog/subcategories');
      }
      // Successful, thus render.
      res.render('subcategory_delete', {
        title: 'Delete Sub-Category',
        subcategory: results.subcategory,
        subcategory_products: results.subcategory_products,
      });
    }
  );
};

// Display subcategory delete on POST.
exports.subcategory_delete_post = (req, res, next) => {
  async.parallel(
    {
      subcategory: (callback) => {
        Subcategory.findById(req.body.subcategoryid).exec(callback);
      },
      subcategory_products: (callback) => {
        Product.find({ subcategory: req.body.subcategoryid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) () => next(err);
      // Success
      if (results.subcategory_products.length > 0) {
        // Sub-category has products. Render in same way as for GET route.
        res.render('subcategory_delete', {
          title: 'Delete Sub-Category',
          subcategory: results.subcategory,
          subcategory_products: results.subcategory_products,
        });
        return;
      } else {
        // Sub-Category has no products. Delete object and redirect to the sub-category list.

        Subcategory.findByIdAndRemove(
          req.body.subcategoryid,
          function deleteSubcategory(err) {
            if (err) () => next(err);
            // Success - go to sub-category list

            res.redirect('/catalog/subcategories');
          }
        );
      }
    }
  );
};

// Display subcategory update form on GET request.
exports.subcategory_update_get = (req, res, next) => {
  // Get subcategory, categories and department.

  async.parallel(
    {
      subcategory: (callback) => {
        Subcategory.findById(req.params.id)
          .populate('category department')
          .exec(callback);
      },
      categories: (callback) => {
        Category.find(callback);
      },
      departments: (callback) => {
        Department.find(callback);
      },
    },
    (err, results) => {
      if (err) () => next(err);
      if (results.subcategory == null) {
        // No results.
        let err = new Error('Product not found');
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render('subcategory_form', {
        title: 'Update Sub-Category',
        categories: results.categories,
        departments: results.departments,
        subcategory: results.subcategory,
      });
    }
  );
};

// Handle subcategory update on POST.
exports.subcategory_update_post = [
  //Validate and sanitize fields.
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

    // Create a sub-category object with escaped and trimmed data.
    const subcategory = new Subcategory({
      name: req.body.name,
      description: req.body.description,
      department: req.body.department,
      category: req.body.category,
      _id: req.params.id, // This is required or a new ID will be assigned!
    });
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories,  and departments for form.
      async.parallel({
        categories: (callback) => Category.find(callback),
        departments: (callback) => Department.find(callback),
      }),
        (err, results) => {
          if (err) () => next(err);
          res.render('subcategory_form', {
            title: 'Update Sub-Category',
            categories: results.categories,
            departments: results.departments,
            subcategory: subcategory,
            errors: errors.array(),
          });
        };
      return;
    } else {
      Subcategory.findByIdAndUpdate(
        req.params.id,
        subcategory,
        {},
        function (err, thesubcategory) {
          if (err) () => next(err);
          // Successful, thus, redirect to subcategory detail page.
          res.redirect(thesubcategory.url);
        }
      );
    }
  },
];
