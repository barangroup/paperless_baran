var db = require('mongo_schemas');
var _ = require('lodash');

module.exports = (function() {
  var _return = {};

  _return.get = function(req, res, next) {
    next();
  };

  _return.post = function(req, res) {
    if (_.includes(req.user._permissions, "root") && req.body.members && req.body.task) {
      db.users.update({
        _id: {
          $in: req.body.members
        }
      }, {
        $addToSet: {
          task: req.body.task
        }
      }, {
        multi: true
      }, function(err, r) {
        if (err) {
          console.log(err);
        } else if (r) {
          res.json({
            add: r
          });
          // it's done and below codes are just for logging!!!
          db.users.find({
            _id: {
              $in: req.body.members
            }
          }, {
            first_name: true,
            last_name: true
          }).lean().exec(function(err, users) {
            if (err) {
              console.log(err);
            } else if (users) {
              db.tasks.findOne({
                _id: req.body.task
              }, {
                name: true,
                title: true
              }).lean().exec(function(err, task) {
                if (err) {
                  console.log(err);
                } else {
                  users.forEach(function(user) {
                    console.log("*** " + req.user.first_name + " " + req.user.last_name + " assign " + user.first_name + " " + user.last_name + " as " + task.name + "/" + task.title);
                  });
                }
              })
            }
          });
        }
      });
    } else res.status(403).jon({
      err: "permission"
    });
  };
  return _return;
})();
