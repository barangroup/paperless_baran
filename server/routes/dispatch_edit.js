//
//
//

var _ = require('lodash');
var db = require('mongo_schemas');
const edit_dispatch = require('core/dispatch/edit');

module.exports = (function() {
  var _return = {};

  _return.post = function(req, res, next) {

    if (!req.body._id || !req.body.data) {
      return res.status(400).json({
        err: "low args"
      });
    }

    var dispatch_id = req.body._id;
    var new_dispatch = req.body.data;

    db.dispatch.findOne({
      _id: dispatch_id
    }, {
      _leader: true
    }).lean().exec(function(err, dispatch) {


      if (String(dispatch._leader) == String(req.user._id)) {
        edit_dispatch(new_dispatch, function(err, edit) {

          res.json({
            edit: edit
          });

          console.log(req.user.first_name + " " + req.user.last_name + " edit a dispatch -> " + dispatch_id);

        });
      } else {

        console.log(req.user.first_name + " " + req.user.last_name + " edit a dispatch without permission!");
        res.status(403).json({});
      }
    })
  };

  _return.get = function(req, res) {
    next();
  };

  return _return;
})();
