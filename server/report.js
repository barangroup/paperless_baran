//
// export dispatchs on readable text mode
//
// require this file in project for running
// and after running copy the text to a text file
// or pipe the steam to a file, like this :
//
// node bin/www >> ~/Desktop/export.txt
//

const db = require('db');

db.dispatch.find({
  // _station: "581e1e80aa11e869439f4bbd"
}, {
  costs: false
}).sort({
  date: -1
}).populate({
  path: '_leader',
  select: 'first_name last_name -_id'
}).populate({
  path: 'members',
  select: 'first_name last_name -_id'
}).populate({
  path: '_station',
  select: 'name male female'
}).lean().exec(function(err, dispatchs) {
  if (err) {
    console.log(err);
  } else if (dispatchs) {

    dispatchs.forEach(function(dispatch) {
      Date.en_to_persion_date(dispatch.date, function(date) {
        dispatch.date = date.date;

        console.temp(" " + "مرکز:");
        console.temp(dispatch._station.name);
        console.temp();
        console.temp(" " + "تاریخ:");
        console.temp(dispatch.date);

        console.temp();
        console.temp(" " + "رابط:");
        console.temp(dispatch._leader.first_name + " " + dispatch._leader.last_name);

        console.temp();
        console.temp(" " + "اعضا:");

        dispatch.members.forEach(function(member) {
          console.temp(member.first_name + " " + member.last_name);
        })

        console.temp();
        console.temp(" " + "متن گزارش:");
        console.temp(dispatch.comment);
        console.temp();
        console.temp('-----------------------------------------------------');
        console.temp();
      });
    });
  };
});
