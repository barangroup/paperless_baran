 var _ = require('lodash');
 var db = require('mongo_schemas');

 module.exports = (function() {
   var _return = {};

   _return.get = function(req, res, next) {

     if (req.user && req.query) {
       var _root = _.includes(req.user._permissions, "root"),
         _see_all_women = _.includes(req.user._permissions, "see_all_woman_dispatch"),
         _see_all_man = _.includes(req.user._permissions, "see_all_man_dispatch"),
         _see_all_users = (_see_all_man && _see_all_women);

       var query = {};
       if (_root || _see_all_man || _see_all_women || _see_all_users) {

         if (!(_see_all_users || _root)) {
           if (_see_all_man) {
             query.male = true;
           } else if (_see_all_women) {
             query.female = true;
           }
         } else {
           query.male = true;
           query.female = true;
         }

         if (req.query.type && req.query.type == "list") {
           db.dispatch.find({}, {
             _station: true,
             _leader: true,
             date: true
           }).sort({
             date: -1
           }).populate({
             path: '_leader',
             select: 'first_name last_name -_id'
           }).populate({
             path: '_station',
             select: 'name male female -_id'
           }).lean().exec(function(err, dispatchs) {
             if (err) {
               console.log(err);
               res.json({
                 err: err
               });
             } else if (dispatchs) {
               for (var i = 0; i < dispatchs.length; i++) {
                 if (!(query.male && query.female)) {
                   if (query.male) {
                     if (!dispatchs[i]._station.male) {
                       dispatchs.splice(i--, 1);
                     }
                   } else if (query.female) {
                     if (!dispatchs[i]._station.female) {
                       dispatchs.splice(i--, 1);
                     }
                   }
                 }

               }

               dispatchs.forEach(function(dispatch) {
                 Date.en_to_persion_date(dispatch.date, function(date) {
                   dispatch.date = date.date;
                 });
               });


               res.json(dispatchs);
             };
           });
         } else if (req.query.type = "get_data", req.query._id) {
           db.dispatch.findOne({
             _id: req.query._id
           }, {
             __v: false
           }).populate({
             path: '_station',
             select: 'name male female -_id'
           }).populate({
             path: 'members',
             select: 'first_name last_name -_id'
           }).populate({
             path: '_leader',
             select: 'first_name last_name'
           }).populate({
             path: 'costs',
             select: 'cost comment -_id'
           }).lean().exec(function(err, dispatch) {
             if (err) {
               console.log(err);
               res.json({
                 err: err
               });
             } else if (dispatch) {

               if (dispatch._station &&
                 ((dispatch._station.male && query.male) ||
                   (dispatch._station.female && query.female))) {

                 var c = 0;
                 dispatch.costs.forEach(function(cost) {
                   c += cost.cost;
                 });

                 dispatch.costs = c;

                 if (dispatch.date) {
                   Date.en_to_persion_date(dispatch.date, function(date) {
                     dispatch.date = date.date;
                   });
                 }
                 res.json(dispatch);
               } else {
                 res.status(403).json({
                   err: "permission denied"
                 });
               }
             } else {
               res.json({
                 err: "not found"
               });
             }
           });
         } else {
           res.json({
             err: "low args"
           });
         }

         // Old Strategy

         // db.dispatch.find({}, {
         // 	__v: false
         // }).populate({
         // 	path: 'members',
         // 	select: 'first_name last_name -_id'
         // }).populate({
         // 	path: '_leader',
         // 	select: 'first_name last_name -_id'
         // }).populate({
         // 	path: '_station',
         // 	select: 'name male female -_id',
         // 	match: query
         // }).populate({
         // 	path: 'costs',
         // 	select: 'cost comment -_id'
         // }).lean().exec(function(err, dispatchs) {
         // 	if (err) {
         // 		console.log(err);
         // 		res.json({
         // 			err: true
         // 		});
         // 	} else if (dispatchs) {

         // 		for (var i = 0; i < dispatchs.length; i++) {
         // 			if (!dispatchs[i]._station) {
         // 				dispatchs.splice(i--, 1);
         // 			} else {
         // 				var c = 0;
         // 				dispatchs[i].costs.forEach(function(cost) {
         // 					c += cost.cost;
         // 				});
         // 				dispatchs[i].costs = c;
         // 				if (dispatchs[i].date) {
         // 					Date.en_to_persion_date(dispatchs[i].date, function(date) {
         // 						dispatchs[i].date = date.date;
         // 					});
         // 				}
         // 			}
         // 		}
         // 		res.json(dispatchs.slice(req.query.from, req.query.to)); // What The HELL!
         // 	}
         // });

       } else res.status(403).json({
         err: "permission denied"
       });
     } else res.json({
       err: "low args"
     });
   };

   _return.post = function(req, res, next) {
     // under construct
   };

   return _return;
 })();
