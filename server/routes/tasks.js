var db = require('mongo_schemas');
var _ = require('lodash');

module.exports = (function() {
  var _return = {};

  _return.get = function(req, res, next) {
    if (_.includes(req.user._permissions, "root")) {
      db.tasks.findOne({
        name: "root"
      }, {
        __v: false
      }).lean().exec(function(err, task) {
        if (err) console.log(err);
        else if (task) {
          String.bfs(task._id, function(tree) {
            res.json(tree);
          });
        }
      });
    } else next();
  };

  _return.post = function(req, res, next) {
    if (_.includes(req.user._permissions, "root")) {

    } else next();
  };

  return _return;
})();
