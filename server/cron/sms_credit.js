

var db = require('mongo_schemas'),
    CronJob = require('cron').CronJob;
    sms = require("send_sms");
var logs = new CronJob('0 0 0 * * *', function(){
    update_sms_credit();
});

if(global.init.sms_credit_cron){
    logs.start();
}

function update_sms_credit(){
    sms.account_info(function(result){
        if(result && result.return && result.return.status == 200 && result.entries && result.entries.remaincredit ){
            db.sms_config.update({}, { $set: { credit : result.entries.remaincredit } },{ upsert : true } ,function(err){
                if(err) console.log(err);
                // else console.log("sms credit updated");
            });
        } else {
            console.log("error in sms_credit cron");
            console.open(result);
        }


    });
}

// module.exports.update = update_sms_credit ;