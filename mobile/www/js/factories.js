angular.module('starter.factories', [])
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

.factory('Contacts', function($cordovaContacts, $ionicPlatform, $http, configuration, $q) {
  var phonecontacts = [
    {
      //_id: "58d5b11f126dc1357b4ecb83",
      displayName: "jeff",
      phoneNumbers: [
        {
          value: "+18110009999"
        }
      ]
    },
    {
      displayName: "john",
      phoneNumbers: [
        {
          value: "+14151112222"
        }
      ]
    },
    {
      displayName: "Gajotres",
      phoneNumbers: [
        {
          value: "+385959052082"
        },
        {
          value: "+385914600731"
        }
      ]
    },
    {
      //_id: "58d5ae1167961d351728b490",
      displayName: "Morteza",
      phoneNumbers: [
        {
          value: "+18103940029"
        }
      ]
    },
    {
      //_id: "58dae83c283b672a9c5181b7",
      displayName: "Josef",
      phoneNumbers: [
        {
          value: "+18888888888"
        }
      ]      
    }              
  ]
  return {
    getAllContacts: function() {
      var deferred = $q.defer();
      setTimeout(function() {    
        deferred.resolve(phonecontacts);
      }, 100);

      return deferred.promise;
    },

    /*getAllContacts: function() {
      var opts = {
				filter      : '',
				multiple    : true,
				fields      : ['displayName'],
				hasPhoneNumber: true,
      };

      return $cordovaContacts.find(opts).then(function(allContacts) {
      	return allContacts;
    	})
    },*/

    getContactsAccountsIds: function(contactNumbers){
      return $http.post(configuration.apiUrl + 'users/getcontactsaccountsids', contactNumbers);
    },
    getNumbersFromAccountsIds: function(contactIds){
      return $http.post(configuration.apiUrl + 'users/getnumbersfromaccountids', contactIds);
    }
  }
})

.factory('ConversationsFactory', function($http, configuration){
  var apiUrl = configuration.apiUrl + 'conversations';
  return {
    getConversations: function(){
      return $http.get(apiUrl);
    },
    getConversation: function(conversationId){
      return $http.get(apiUrl + '/conversation/' + conversationId);
    },
    getConversationWithContactId: function(contactId){
      return $http.get(apiUrl + '/contact/' + contactId);
    },
    removeFromConversations: function(conversationId){
      return $http.delete(apiUrl + '/' + conversationId);
    },  
  } 
})

.factory('ConversationsSocketFactory', function($rootScope){
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
/*
.factory('ConversationsSocketFactory', function($rootScope, configuration){
  var socket = io.connect(configuration.apiUrl, {
    //query: 'token=' + LSFactory.getData('token')
    });
  return {
    joinRoom: function(conversationId){
      return socket.emit('join', conversationId);
    },
    leaveRoom: function(conversationId){
      return socket.emit('leave', conversationId);
    },    
    sendMessage: function(newMessage){
      return socket.emit('message', newMessage);
    },
    on: function(eventName, callback){
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    }
  } 
})
*/