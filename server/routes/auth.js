var express = require('express');
var router = express.Router();

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file

var codeAuth = require('code-auth');

var User = require('../models/user');

router
.post('/signin/phone', function(req, res) {

  User.findOne({
    phone: req.body.phone
  }, function(err, user) {
    if (err) throw err;

    var authCode = Math.floor((Math.random() * 10000) + 1);  

    if (user) {
      user.auth.authCode = authCode;
      user.auth.confirmed = false;

      user.save(function(err) {
        if (err) throw err;
        res.json({ success: true, authcode: authCode });
      });
    }    
    else {
      var newUser = new User({
        phone: req.body.phone,
        //name: req.body.name,
        auth: {
          authCode : authCode,
          confirmed : false
        }
      });

      newUser.save(function(err) {
        if (err) throw err;
        res.json({ success: true, authcode: authCode });
      });
    }

    codeAuth.sendAuthCode(authCode);
  });
})

.post('/signin', function(req, res) {

  User.findOne({
    phone: req.body.phone
  }, function(err, user) {
    if (err) throw err;

    if(user.auth.authCode == req.body.authCode){
      user.auth.confirmed = true;
      user.save(function(err) {
        if (err) throw err;
        
        // if user is found and authCode is right
        // create a token
        var token = jwt.sign(user, config.secret, {
          //expiresIn: 1440, // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          token: token,
          user: {id: user._id, token: token, phone: user.phone}
        });

      });
    } else{
      res.status(401).send('Authentication failed. Wrong authCode.');
    }   
  });
})

module.exports = router;