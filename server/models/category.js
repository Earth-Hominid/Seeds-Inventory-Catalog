var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
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
    },
  ],
  description: {
    type: String,
    minlength: 5,
    maxlength: 5000,
  },
});

CategorySchema.virtual('url').get(function () {
  return '/catalog/category/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);
