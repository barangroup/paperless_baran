 var _ = require('lodash');
 var db = require('mongo_schemas');

 module.exports = (function() {
     var _return = {};

     _return.get = function(req, res, next) {

         if (req.user && req.query) {


             if (req.query.type && req.query.type == "list") {
                 db.experience.find({
                     _task: {
                         $in: req.user.task
                     }
                 }).populate({
                     path: '_writer',
                     select: 'first_name last_name -_id'
                 }).populate({
                     path: '_task',
                     select: 'title -_id'
                 }).lean().exec(function(err, exps) {
                     if (err) {
                         console.log(err);
                     } else {
                         exps.forEach(function(exp) {
                             Date.en_to_persion_date(exp._id.getTimestamp(), function(date) {
                                 exp.date = date.date;
                             });
                         });
                         res.json(exps);
                     }
                 });
             } else if (req.query.type = "get_data", req.query._id) {

             } else {
                 res.json({
                     err: "low args"
                 });
             }

         } else res.json({
             err: "low args"
         });
     };

     _return.post = function(req, res, next) {
         // under construct
     };

     return _return;
 })();
