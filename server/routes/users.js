var express = require('express');
var router = express.Router();

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

module.exports = router;
