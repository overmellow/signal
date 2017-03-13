var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	senderId: String,
	messageType: String,
	message: String,	
	url: String,
	date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Conversation', new Schema({
	messages: [messageSchema],
	conversationPartners: [{
		type: Schema.Types.ObjectId, ref: 'User'
	}],	
	date: { type: Date, default: Date.now },
}));