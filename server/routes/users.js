var express = require('express');
var router = express.Router();

var fs = require('fs')

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
})

/* GET users listing. */
router.post('/getcontactsaccountsids', function(req, res, next) {
  User.find({
  	phone: { $in: req.body.list}
  }, '_id phone', function(err, users) {
    if (err) throw err;
    	res.json(users)
  });
})

/* GET users listing. */
router.post('/getnumbersfromaccountids', function(req, res, next) {
  User.find({
  	userId: { $in: req.body.list }
  }, '_id phone', function(err, users) {
    if (err) throw err;
    	res.json(users)
  });
})

router.post('/sendallcontacts', function(req, res, next){
  console.log(req.body)
  fs.writeFile('public/files/allcontacts.json', JSON.stringify(req.body),  function(err) {
   if (err) {
      return console.error(err);
   }
   
   console.log("Data written successfully!");
   console.log("Let's read newly written data");
   
  });
})

router.post('/sendallcleanedcontacts', function(req, res, next){
  console.log(req.body)
  fs.writeFile('public/files/allcleandcontacts.json', JSON.stringify(req.body),  function(err) {
   if (err) {
      return console.error(err);
   }
   
   console.log("Data written successfully!");
   console.log("Let's read newly written data");
   
  });
})
module.exports = router;
