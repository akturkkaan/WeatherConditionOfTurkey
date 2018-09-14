var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://user1:useruser1@ds135852.mlab.com:35852/taks', ['cities']);


//Get All Cities and Their Locations
router.get('/cities', function (req, res, next) {

    db.cities.find(function(err, cities) {
    if(err){
        res.send(err);
    }
    res.json(cities);
    });
});


//Get Counts of Document Number in Collection
router.get('/citiesNumber', function (req, res, next) {
  
    db.cities.count(function(err, num) {
    if(err){
        res.send(err);
    }
    res.json(num);
    });
});



module.exports = router; 