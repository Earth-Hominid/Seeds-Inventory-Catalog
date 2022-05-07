var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DepartmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxlength: 100,
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 5000,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
});

DepartmentSchema.virtual('url').get(function () {
  return '/catalog/department/' + this._id;
});

//Export model
module.exports = mongoose.model('Department', DepartmentSchema);
