var _ = require('lodash');
var db = require('mongo_schemas');

module.exports = (function() {
  var _return = {};

  _return.get = function(req, res, next) {
    if (_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "mali_store")) {
      db.mali_store
        .find({}, {
          _id: false
        })
        .populate({
          path: '_creator',
          select: 'first_name last_name -_id'
        })
        .lean()
        .exec(function(err, re) {
          res.json(String.remove_empty_data(re));
        });
    } else res.status(403).send("premission deny!");
  };


  _return.post = function(req, res, next) {

    if (_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "mali_store")) {
      if (req.body.type == "add") {
        var good = req.body.data || {};
        if (good.name) {
          good._id = req.user._id;
          new db.mali_store(good).save(function(err) {
            if (err) {
              console.log(err);
              res.json({
                add: false
              });
            } else {
              res.json({
                add: true
              });
              console.log(req.user.first_name + " " + req.user.last_name + " add a good to mali_store");
            }
          })
        } else res.json({
          add: false
        });
      } else if (req.body.type == "remove" && req.body.data && req.body.data._id) {

        db.logs.remove({
          _id: req.body.data._id
        }, function(err, remove_c) {
          if (err) {
            console.log(err);
            res.json({
              remove: false
            });
          } else {
            console.log(req.user.first_name + " " + req.user.last_name + " removed a good from mali_store");
            res.json({
              remove: true
            });
          }
        });
      } else res.json({
        error: "low args"
      });

    } else next();
  };

  return _return;
})();
