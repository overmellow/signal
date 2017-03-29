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

.factory('Contacts', function($cordovaContacts, $ionicPlatform, $http, configuration) {
  // Might use a resource here that returns a JSON array
  
  return {
    getAllContacts: function() {
      var opts = {
				filter      : '',
				multiple    : true,
				fields      : ['displayName'],
				hasPhoneNumber: true,
      };

      return $cordovaContacts.find(opts).then(function(allContacts) {
      	return allContacts;
    	})
    },

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
/*    addToConversations: function(contact){
      return $http.put(apiUrl + '/addtomycontacts/' + contact._id);
    },
    removeFromConversations: function(contact){
      return $http.delete(apiUrl + '/removefrommycontacts/' + contact.contactee._id + '/' + contact._id + '/' + contact.conversationId);
      //return $http.delete(apiUrl + '/removefrommycontacts/' + contact.contactee._id + '/' + contact._id);
    },
    getContactByConversationId: function(conversationId){
      return $http.get(apiUrl + '/mycontacts/' + conversationId);
    }*/
  } 
})