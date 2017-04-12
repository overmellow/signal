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
		console.log('callback 10')
		//console.log(conversation)
    if(conversation != null && conversation != undefined){
    	console.log('callback 11')
      res.json(conversation);  
    } else {
    	console.log('callback 12')
    	createConversation(req.decoded._doc._id, req.params.contactId, res)
    	.then(function(conversation){
    		console.log('callback 13')
    		console.log(conversation)
    		res.json(conversation)
    	})	
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
			//console.log(conversation)
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

var createConversation = function(userId, contactId, res){
	console.log('callback 5')
	var newConversation = new Conversation({conversationPartners: [userId, contactId]});
	newConversation.messages = []
	newConversation.save(function(err, conversation){
		console.log('callback 6')
		User.findById(userId, function(err, user){
			if(err) res.send(err)
			user.conversations.push(conversation)	
			user.save(function(err){
				console.log('callback 7')
				User.findById(contactId, function(err, contact){
					//if(err) res.send(err)
					contact.conversations.push(conversation)
	        return contact.save(function(err){
	        	console.log('callback 8')
	          //res.json({ success: true, message: 'Conversation is saved successfully!' });
	          console.log(conversation)
	          res.json(conversation)
	          //return conversation;
	        })						
				})			
			})
		})
	})
}