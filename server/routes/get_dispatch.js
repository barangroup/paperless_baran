//
//
//

var _ = require('lodash');
var db = require('mongo_schemas');

module.exports = (function() {
  var _return = {};

  _return.post = function(req, res, next) {


    var _root = _.includes(req.user._permissions, "root"),
      _see_all_women = _.includes(req.user._permissions, "see_all_woman_dispatch"),
      _see_all_man = _.includes(req.user._permissions, "see_all_man_dispatch");

    if (!root || !_see_all_man || !_see_all_women) {
      return res.status(403).json({
        error: true
      });
    }


    if (!req.body._id) {
      return res.status(400).json({});
    }


    var q = db.dispatch.findOne({
      _id: req.body._id
    }).lean();

    console.log("in");

    q.exec(function(err, dispatch) {
      Date.en_to_persion_date(dispatch.date, function(date) {
        dispatch.date = date.date;
      });
      res.json(dispatch);
    })

  };

  _return.get = function(req, res) {
    next();
  };

  return _return;
})();
