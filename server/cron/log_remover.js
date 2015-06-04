
var db = require('mongo_schemas'),
    CronJob = require('cron').CronJob;

var logs = new CronJob('0 0 2 * * *', function(){
    db.logs
        .find({},{ _id : true })
        .sort({ _id: -1 })
        .skip(global.init.mongo_logs_limit)
        .exec(function(err,c){
        if(c && c.length){
            var remove_list = [] ;
            for(i in c){
                remove_list.push(c[i]._id);
            }
            db.logs.remove( { _id : { $in : remove_list } },function(err,remove_c){
                console.log( "* removing extra logs -> " + remove_c );
            });
        }
        else {
            console.log('* no log to delete!');
        }
    });
});


logs.start();
