
var db = require('mongo_schemas');
var _ = require('lodash');


module.exports = (function () {
    var _return = {};

    _return.get = function (req, res, next) {
        next();
        // db.stations.find().populate({
        //                 path: '_creator',
        //                 select: 'first_name last_name -_id'
        //             }).lean().exec(function(err,stations){
        //                 if(err){
        //                     console.log(err);
        //                 } else if (stations){
        //                     // todo : add persion date to each on
        //                     res.json(stations);
        //                 }
        //         });
    };

    _return.post = function (req, res, next) {
        /* 
        data need to be something like this :
        { 
            type : "add/list/edit" , 
            data : {}
        }
        */

        // temp
        req.body.data = {} ;
        req.body.data = req.body ;

        if(( _.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "stations"))){
            if( req.body && req.body.type == "add" && req.body.data) {
                var station = req.body ;
                station._creator = req.user._id ;
                new db.stations(station).save(function(err){
                    if(err) {
                        console.log(err);
                        res.json({ add : false });
                    } else {
                        res.json({ add : true });
                    }
                });
            } else if(req.body && req.body.type == "list"){
                db.stations.find().populate({
                        path: '_creator',
                        select: 'first_name last_name -_id'
                    }).lean().exec(function(err,stations){
                        if(err){
                            console.log(err);
                        } else if (stations){
                            // todo : add persion date to each on
                            res.json(stations);
                        }
                });
            }
        } else next();
                
    };

    return _return;
})();