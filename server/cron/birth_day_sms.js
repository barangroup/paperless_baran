
var db = require('mongo_schemas'),
    CronJob = require('cron').CronJob,
    send_sms = require('send_sms_log');


var job = new CronJob('0 0 22 * * *', function(){

    db.birthday_sms.findOne({},{ text : true , enable : true , _id : false }).lean().exec(function(err,birthday_sms){
        if(err) console.log(err);
        else if(birthday_sms.enable){
            db.users.find({ birth_date : { $exists : true } },{ _id : false , birth_date : true ,mobile : true ,first_name : true , last_name : true }).lean().exec(function(err,users){
                console.log( "checking " + users.length + " user(s) for birthDay!");
                users.forEach(function(user){
                    var birth_date = new Date(user.birth_date);
                    var date = new Date();
                    if(birth_date.getMonth() == date.getMonth() && date.getDate() == birth_date.getDate() ){
                        console.log("sending birthDay SMS -> " + user.first_name + " " + user.last_name)
                        // TODO something is wrong here
                            send_sms({ text : birthday_sms.text , to : String.dec_mobile(user.mobile)  },"sending");
                    }
                });
            });
        } else {
            console.log("* birthday sms is disable in DB");
        }
    });
});

if(global.init.birthday_sms){
    job.start();
}
