const Product = require('../models/product');
const Department = require('../models/department');
const Category = require('../models/category');
const SubCategory = require('../models/subcategory');

const async = require('async');

exports.index = (req, res) => {
  async.parallel(
    {
      product_count: (callback) => {
        Product.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      department_count: (callback) => {
        Department.countDocuments({}, callback);
      },
      category_count: (callback) => {
        Category.countDocuments({}, callback);
      },
      subcategory_count: (callback) => {
        SubCategory.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render('index', {
        title: 'Seeds Home',
        error: err,
        data: results,
      });
    }
  );
};
