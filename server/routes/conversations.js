var express = require('express');
var router = express.Router();

var sync    = require('synchronize')

var User = require('../models/user');
var Conversation = require('../models/conversation');

router
.get('/', function(req, res) {
  User.findById(req.decoded._doc._id)
  .populate({
  	path: 'conversations',
  	populate: {
  		path: 'conversationPartners',
  		model: 'User',
  		select: 'phone'}
  	})
  .exec()
  .then(function(user){
  	res.json(user.conversations);
	})
})

.get('/conversation/:conversationId', function(req, res) {
  Conversation.findById(req.params.conversationId)
  .then(function(conversation){
    if(conversation != null && conversation != undefined){
      res.json(conversation);  
    }
  })
})

.get('/contact/:contactId', function(req, res){
	getConversation(req.decoded._doc._id, req.params.contactId/*, createConversation*/)
	.then(function(conversation){
		console.log('callback 0')
		console.log(conversation)
    if(conversation != null && conversation != undefined){
      res.json(conversation);  
    }
	})	
})

.delete('/:conversationId', function(req, res){
	Conversation.findById(req.params.conversationId, function(err, conversation){
		User.find({conversations: req.params.conversationId}, function(err, users){
			if(users != null || users != undefined){
				users.forEach(function(user){
					user.conversations.pull(req.params.conversationId)
					user.save()
				})
				Conversation.findByIdAndRemove(req.params.conversationId, function(){
					res.json('conversation deleted successfully!')
				})
			}			
		})
	})
})
/*
.get('/copyaccountsids', function(req, res) {
  User.find()
  .exec(function(err, users){
	  if (err) return handleError(err);
  	for(var x in users){
  		users[x].userId = users[x]._id;
  		users[x].save(function(err){
  			if(err) return handleError(err)
  		})
  	} 
  })
})*/

module.exports = router;

var getConversation = function(userId, contactId, callback){
	console.log('callback 1')
	console.log(userId + ' ' + contactId)
	return Conversation.findOne({ conversationPartners: userId, conversationPartners: contactId})
  .then(function(conversation){
  	console.log('callback 1.1')
		if(conversation != null && conversation != undefined){
			console.log('callback 1.2')
			console.log(conversation)
			return conversation
		} else {
			console.log('callback 2')
			if (callback && typeof(callback) == "function"){
				console.log('callback 3')
				return callback(userId, contactId)	
			} else {
				console.log('callback 4')
				return null;
			}
		}
	})
}

var createConversation = function(userId, contactId){
	console.log('callback 4')
	var newConversation = new Conversation({conversationPartners: [userId, contactId]});
	newConversation.save(function(err, conversation){
		User.findById(userId, function(err, user){
			if(err) res.send(err)
			user.conversations.push(conversation)	
			user.save(function(err){
				User.findById(contactId, function(err, contact){
					//if(err) res.send(err)
					contact.conversations.push(conversation)
	        contact.save(function(err){
	          //res.json({ success: true, message: 'Conversation is saved successfully!' });
	          return conversation;
	        })						
				})			
			})
		})
	})
}