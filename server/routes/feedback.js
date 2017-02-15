var _ = require('lodash');

var db = require('mongo_schemas');

module.exports = (function() {
  var _return = {};

  _return.get = function(req, res, next) {
    if (_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "feedbacks")) {
      db.feedback
        .find({}, {
          _id: false
        })
        .populate({
          path: '_writer',
          select: 'first_name last_name -_id'
        })
        .lean()
        .exec(function(err, re) {
          res.json(String.remove_empty_data(re));
        });
    } else res.status(403).send("premission deny!");
  };


  _return.post = function(req, res, next) {

    if (req.user && req.body && req.body.text) {
      data = {};
      data.text = req.body.text;
      if (req.body.allow_writer) data._writer = req.user._id;
      new db.feedback(data).save(function(err, saved_data) {
        if (err) console.log(err);
        if (saved_data._writer) {
          console.log(req.user.first_name + " " + req.user.last_name + " add new feedback!");
          res.json({
            saved: true
          });
        } else {
          console.log("someone anonymously add new feedback!");
          res.json({
            saved: true
          });
        }
      });
    } else next();
  };

  return _return;
})();
