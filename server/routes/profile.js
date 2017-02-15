//var encrypt = require('encrypt');
var db = require('mongo_schemas');
//var _ = require('underscore');

module.exports.get = function(req, res, next) {


  if (req.session.q) {
    res.render('profile');
  } else {
    res.render('index');
  }
};

module.exports.post = function(req, res, next) {
  next();
};
