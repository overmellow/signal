var express = require('express');
var router = express.Router();

var sync    = require('synchronize')

var User = require('../models/user');
var Conversation = require('../models/conversation');

router
/*// get specific task specified by taskId
.get('/messages/:conversationId', function(req, res) {
  Conversation.findById(req.params.conversationId).exec(function(err, conversation){
    if(conversation != null && conversation != undefined){
      res.json(conversation.messages);  
    }
  })
})*/

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
})


// get specific contacts of specified user by userId
.get('/', function(req, res) {
  User.findById(req.decoded._doc._id)
  .populate({path: 'conversations', populate: {path: 'conversationPartners', model: 'User', select: 'phone'}})
  .exec(function(err, user){
	  if (err) return handleError(err);
  	res.json(user.conversations);
  })
})

.post('/:id', function(req, res){
	if(!getConversation(req.decoded._doc._id, req.params.id))
	{
		createConversation(req.decoded._doc._id, req.params.id)
	}
	
})

module.exports = router;

var getConversation = function(userId, contactId){
	Conversation.findOne({conversationPartners: userId, conversationPartners: contactId})
	  .exec(function(err, conversation){
	  	if (err) return handleError(err);
			//console.log(conversation)
			return;			
		})
	}

function createConversation(userId, contactId){
	var newConversation = new Conversation({conversationPartners: [userId, contactId]});
	newConversation.save(function(err, conversation){
		User.findById(userId, function(err, user){
			if(err) res.send(err)
			user.conversations.push(conversation)	
			user.save(function(err){
				User.findById(contactId, function(err, contact){
					if(err) res.send(err)
					contact.conversations.push(conversation)
	        contact.save(function(err){
	          //res.json({ success: true, message: 'Conversation is saved successfully!' });
	          return;
	        })						
				})			
			})
		})
	})
}