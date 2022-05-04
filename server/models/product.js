var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxlength: 50,
  },
  stockNumber: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5000,
  },
  price: {
    type: Number,
    minlength: 1,
    maxLength: 10,
  },
  packageSize: {
    type: String,
    minLength: 2,
    maxlength: 100,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  image: {
    data: Buffer,
    contentType: String,
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
  subcategory: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true,
    },
  ],
  dateCreated: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updated: {
    type: Date,
    default: Date.now(),
  },
});

ProductSchema.virtual('url').get(function () {
  return '/catalog/product/' + this._id;
});

module.exports = mongoose.model('Product', ProductSchema);
