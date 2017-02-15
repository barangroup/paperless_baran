var db = require('mongo_schemas');
var _ = require('lodash');

module.exports = (function() {
  var _return = {};

  _return.get = function(req, res, next) {
    if (_.includes(req.user._permissions, "root")) {
      db.poll.find().lean().exec(function(err, _r) {
        if (err) {
          console.log(err);
          res.json([]);
        } else {
          res.json(_r);
        }
      });
    } else next();
  };

  _return.post = function(req, res, next) {
    next();
  };

  return _return;
})();
