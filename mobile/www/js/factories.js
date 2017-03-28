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

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
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
    }
  }
})