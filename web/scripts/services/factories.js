angular.module('myApp')
.factory('ContactFactory', function($http, configuration){
	var apiUrl = configuration.apiUrl + 'contacts';
	return {
		getContacts: function(){
			return $http.get(apiUrl);
		},
		getMyContacts: function(){
			return $http.get(apiUrl + '/mycontacts');
		},
		addToMyContacts: function(contact){
			return $http.put(apiUrl + '/addtomycontacts/' + contact._id);
		},
		removeFromMyContacts: function(contact){
			return $http.delete(apiUrl + '/removefrommycontacts/' + contact.contactee._id + '/' + contact._id + '/' + contact.conversationId);
			//return $http.delete(apiUrl + '/removefrommycontacts/' + contact.contactee._id + '/' + contact._id);
		},
		getContactByConversationId: function(conversationId){
			return $http.get(apiUrl + '/mycontacts/' + conversationId);
		}
	}	
})
.factory('AuthFactory', function($http, configuration){
	return {
		signinPhone: function(user){
			return $http.post(configuration.apiUrl + 'signin/phone', user);
		},
		signin: function(user){
			return $http.post(configuration.apiUrl + 'signin', user);
		},
	}	
})
.factory('NotificationFactory', function () {
	var storage = {}
	storage.notifications = [];

	return {
		addNotification: function(newNotification){
			storage.notifications.push(newNotification);
		},
		latestNotification: function(){
			return storage.notifications.pop();
		},
		allNotification: function(){
			return storage.notifications;
		}
	}
})
.factory('ConversationFactory', function($rootScope){
	return {
		joinRoom: function(conversationId){
			return $rootScope.socket.emit('join', conversationId);
		},
		leaveRoom: function(conversationId){
			return $rootScope.socket.emit('leave', conversationId);
		},		
		sendMessage: function(newMessage){
			return $rootScope.socket.emit('message', newMessage);
		}
	}	
})
.factory('ConversationMessagesFactory', function($http, configuration){
	var apiUrl = configuration.apiUrl + 'conversations/messages';
	return {
		getConversationMessages: function(conversationId){
			return $http.get(apiUrl + '/' + conversationId);
		},	
	}	
})
/*.factory('MessageFactory', function($http, apiUrl){
	apiUrl += 'messages';
	return {
		sendMessage: function(newTask){
			return $http.post(apiUrl + '/', newTask);
		},
	}	
})*/