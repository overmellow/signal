var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
	phone: String,
	name: String,
	userId: String
})

module.exports = mongoose.model('User', new Schema({
  userId: String,
  phone: String,
  auth: {
    authCode: Number,
    confirmed: Boolean,
  },
  name: String,
  conversations: [{
  	type: Schema.Types.ObjectId, ref: 'Conversation'
  }],
  contacts:[/*contactSchema*/]
}));