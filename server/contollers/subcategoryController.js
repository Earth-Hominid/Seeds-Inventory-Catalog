const Subcategory = require('../models/subcategory');

// Display list of all subcategories
exports.subcategory_list = (req, res, next) => {
  Subcategory.find()
    .sort([['name', 'ascending']])
    .exec((err, list_subcategories) => {
      if (err) {
        return next(err);
      }
      //Successful, thus return
      res.status(200).json(list_subcategories);
    });
};

// Display detail page for a specific subcategory:
exports.subcategory_detail = (req, res) =>
  res.send('Not implemented yet: subcategory detail: ' + req.params.id);

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
