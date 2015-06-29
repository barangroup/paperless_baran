var v = require('validator');
var db = require('mongo_schemas');
var _ = require('lodash');
var encrypt = require('encrypt');


db.users.aggregate({
		$project: {
			name: {
				$concat: ["$first_name", " ", "$last_name"]
			}
		}
	}, {
		$match: {
			name: 'something'
		}
	}, {
		$limit: 5
	}, {
		$project: {
			_id: "$_id"
		}
	},
	function(err, rr) {
		if (err) console.log(err);
		// console.open(rr);
	});