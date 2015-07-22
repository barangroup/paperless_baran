 var _ = require('lodash');
 var db = require('mongo_schemas');

 module.exports = (function() {
 	var _return = {};

 	_return.get = function(req, res, next) {

 		if (req.user && req.query /* && req.query.to && req.query.from*/ ) { // todo add to and from to query
 			var _root = _.includes(req.user._permissions, "root"),
 				_see_all_women = _.includes(req.user._permissions, "see_all_man_dispatch"),
 				_see_all_man = _.includes(req.user._permissions, "see_all_woman_dispatch"),
 				_see_all_users = (_see_all_man && _see_all_women);

 			var query = {};
 			if (_root || _see_all_man || _see_all_women || _see_all_users) {

 				// if (!(_see_all_users || _root)) {
 				// 	if (_see_all_man) {
 				// 		query.gender = true;
 				// 	} else if (_see_all_women) {
 				// 		query.gender = {
 				// 			$exists: false
 				// 		};
 				// 	}
 				// }

 				db.dispatch.find(query, {
 					__v: false
 				}).populate({
 					path: 'members',
 					select: 'first_name last_name -_id'
 				}).populate({
 					path: '_leader',
 					select: 'first_name last_name -_id'
 				}).populate({
 					path: 'costs',
 					select: 'cost comment -_id'
 				}).lean().exec(function(err, dispatchs) {
 					if (err) {
 						console.log(err);
 						res.json({
 							err: true
 						});
 					} else if (dispatchs) {
 						res.json(dispatchs);
 					}
 				});

 			} else res.json({});
 		} else res.json({
 			err: "low args"
 		});
 	};

 	_return.post = function(req, res, next) {
 		// under construct
 	};

 	return _return;
 })();