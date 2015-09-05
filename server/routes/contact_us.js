 var _ = require('lodash');
 var db = require('mongo_schemas');

 module.exports = (function() {
 	var _return = {};

 	_return.get = function(req, res, next) {
 		next();
 	};

 	_return.post = function(req, res, next) {
 		if (req.body.text) {
 			new db.contact_us(req.body).save(function(err) {
 				if (err) {
 					res.json({
 						save: false,
 						err: err
 					});
 				} else {
 					res.json({
 						save: true
 					});
 					console.log(" * someone add contact_us...");
 				}
 			});
 		} else {
 			res.json({
 				err: "low args"
 			});
 		}
 	};

 	return _return;
 })();