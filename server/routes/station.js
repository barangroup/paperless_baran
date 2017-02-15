var db = require('mongo_schemas');
var _ = require('lodash');


module.exports = (function() {
  var _return = {};

  _return.get = function(req, res, next) {
    db.stations
      .find({}, {
        name: true,
        male: true,
        female: true,
        age_from: true,
        age_to: true
      })
      .populate({
        path: '_creator',
        select: 'first_name last_name -_id'
      }).lean().exec(function(err, stations) {
        if (err) {
          console.log(err);
        } else if (stations) {
          // todo : add persion date to each on
          res.json(stations);
        }
      });
  };

  _return.post = function(req, res, next) {
    /*
    data need to be something like this :
    {
        type : "add/list/edit" ,
        data : {}
    }
    */

    // console.open(req.body);
    if ((_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "stations"))) {
      if (req.body && req.body.type == "add" && req.body.data) {
        var station = req.body.data;
        station._creator = req.user._id;
        new db.stations(station).save(function(err, data) {
          if (err) {
            console.log(err);
            res.json({
              add: false
            });
          } else if (data) {
            res.json({
              add: true,
              data: data
            });
            console.log(req.user.first_name + " " + req.user.last_name + " add a new station -> " +
              data.name);
          }
        });
      } else if (req.body && req.body.type == "list") {
        db.stations.find().populate({
          path: '_creator',
          select: 'first_name last_name -_id'
        }).lean().exec(function(err, stations) {
          if (err) {
            console.log(err);
          } else if (stations) {
            // todo : add persion date to each on
            res.json(stations);
          }
        });
      } else if (req.body && req.body.type == "edit" && req.body.data) {
        db.stations.findOne({
          _id: req.body.data._id
        }, function(err, station) {
          if (err) {
            console.log(err);
          } else if (station) {
            for (i in req.body.data) {
              if (i.charAt(0) != "_")
                station[i] = req.body.data[i];
            }
            station.save(function(err) {
              if (err) {
                console.log(err);
                res.json({
                  edit: false
                });
              } else {
                res.json({
                  edit: true
                });
                console.log(req.user.first_name + " " + req.user.last_name + " edit a station.");
              }
            });
          }
        });
      }
    } else next();

  };

  return _return;
})();
