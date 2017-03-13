var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
  email: String,
  password: String,
  name: String,
  conversations: [{
  	type: Schema.Types.ObjectId, ref: 'Conversation'
  }],
  contacts:[]
}));