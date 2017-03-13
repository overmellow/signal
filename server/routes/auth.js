var express = require('express');
var router = express.Router();

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file

var User = require('../models/user');

router
.post('/login', function(req, res) {

  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.status(401).send('Authentication failed. User not found.');
      //res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        //res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        res.status(401).send('Authentication failed. Wrong password.');
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, config.secret, {
          //expiresIn: 1440, // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          token: token,
          user: {id: user._id, email: user.email, name: user.name, token: token}
        });
      }   
    }
  });
})
.post('/signup', function(req, res) {

  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (user) {
      	res.json({ success: false, message: 'User exist!' });
    }
    else {
	  	var newUser = new User({
		  	email: req.body.email,
		  	password: req.body.password,
        name: req.body.name
	  	});

  		newUser.save(function(err) {
  			if (err) throw err;
  			res.json({ success: true });
  		});
    }
  });
})

module.exports = router;