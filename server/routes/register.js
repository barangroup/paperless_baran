module.exports = (function() {
	var _return = {};

	_return.get = function(req, res) {
		res.render('register');
	};

	_return.post = function(req, res, next) {

		console.open(req.body);
		if (req.body &&
			req.body.mobile &&
			req.body.first_name &&
			req.body.last_name &&
			valid.isNumeric(req.body.mobile) &&
			(req.body.mobile.length == 10 || req.body.mobile.length == 11)) {

			var user = req.body;

			if (user.mobile) user.mobile = String.remove_space(user.mobile);

			db.users.findOne({
				mobile: String.enc_mobile(user.mobile)
			}, {
				_id: true,
				first_name: true,
				last_name: true
			}).lean().exec(function(err, u) {
				if (err) {
					console.log(err);
					res.json({
						add: false
					});
				} else if (u) {
					res.json({
						add: false,
						exists: true
					});
					console.log(u.first_name + " " + u.last_name + " try to sign up but he/she exists in DB.");
				} else {
					user.mobile = String.enc_mobile(user.mobile);

					if (user.birth_year && user.birth_month && user.birth_day) {
						date_convert.to_miladi({
							year: user.birth_year,
							month: user.birth_month,
							day: user.birth_day
						}, function(date) {
							user.birth_date = date;
							new db.users(user).save(function(err, u) {
								if (err) {
									console.log(err);
									res.json({
										add: false
									});
								} else {
									console.log(u.first_name + " " + u.last_name + " sign up with site.");
									res.json({
										add: true
									});
								}
							});
						});
					} else {
						new db.users(user).save(function(err, u) {
							if (err) {
								console.log(err);
								res.json({
									add: false
								});
							} else {
								console.log(u.first_name + " " + u.last_name + " sign up with site.");
								res.json({
									add: true
								});
							}
						});
					}
				}
			});
		} else {
			console.log("not valid data send for sign up reoute.");
			res.json({
				valid: false
			});
		}
	};

	return _return;
})();