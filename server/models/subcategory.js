var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SubcategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxlength: 100,
  },
  department: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
  ],
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  ],
  description: {
    type: String,
    minlength: 5,
    maxlength: 5000,
  },
});

SubcategorySchema.virtual('url').get(function () {
  return '/catalog/subcategory/' + this._id;
});

module.exports = mongoose.model('Subcategory', SubcategorySchema);
