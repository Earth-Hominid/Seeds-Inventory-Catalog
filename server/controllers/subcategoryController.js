const Subcategory = require('../models/subcategory');
const Category = require('../models/category');
const Product = require('../models/product');
const async = require('async');

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
exports.subcategory_create_get = (req, res) =>
  res.send('Not implemented yet: subcategory create GET');

// Handle subcategory create on POST
exports.subcategory_create_post = (req, res) =>
  res.send('Not implemented yet: subcategory create POST');

// Display subcategory delete form on GET request.
exports.subcategory_delete_get = (req, res) =>
  res.send('Not implemented yet: subcategory delete GET');

// Display subcategory delete on POST.
exports.subcategory_delete_post = (req, res) =>
  res.send('Not implemented: subcategory delete POST');

// Display subcategory update form on GET request.
exports.subcategory_update_get = (req, res) =>
  res.send('Not implemented: subcategory update GET');

// Handle subcategory update on POST.
exports.subcategory_update_post = (req, res) =>
  res.send('Not implemented: subcategory update POST');
