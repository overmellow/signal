angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state, LSFactory, $ionicHistory) {
  $scope.$on("$ionicView.enter", function(event, data){
    if(!LSFactory.getData('token')){
      $state.transitionTo("signinphone");
    }

    $scope.data = LSFactory.getData('token'); 
    $scope.logout = function(){
      delete $scope.user;
      LSFactory.removeData('currentUser');
      LSFactory.removeData('token');
      LSFactory.removeData('signinUser');

      $ionicHistory.clearCache().then(function() {
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        $state.transitionTo("signinphone");
    })
    }
  })
})

.controller('signinPhoneCtrl', function($scope, $state, LSFactory, AuthFactory, $location) {
  $scope.user = {}
  $scope.signinPhone = function(user){  
    AuthFactory.signinPhone(user)
      .then(function(res){
        LSFactory.setData('signinUser', user, true)
        console.log(res.data.authcode)
        $state.go('signinauthcode')              
      }, function(err){
        $scope.notification = err.data;
      })
  }
})

.controller('signinAuthcodeCtrl', function($scope, $state, LSFactory, AuthFactory, $location, $rootScope) {
  $scope.user = LSFactory.getData('signinUser', true)

  $scope.signinAuthcode = function(user){
    AuthFactory.signin(user)
      .then(function(res){        
        //$rootScope.user = res.data.user;
        LSFactory.setData('currentUser', res.data.user, true);
        LSFactory.setData('token', res.data.token);
        LSFactory.removeData('signinUser')
        $state.go('tab.chats')
      }, function(err){
        $scope.notification = err.data;
      })
  }
})

.controller('contactsCtrl', function($scope, $stateParams, Contacts) {
  $scope.$on("$ionicView.enter", function(event, data){
    Contacts.getAllContacts().then(function(allContacts){     
      var contactsNumbers = cleanContactsPhoneNumbers(allContacts)
      Contacts.getContactsAccountsIds(contactsNumbers)
        .then(function(res){
          addAccountsIdsToContacts(allContacts, res.data)
        }, function(err){
          console.log(err)
        });

      $scope.contacts = allContacts
    }, function(err){})
  });
})

.controller('conversationsCtrl', function($scope, ConversationsFactory, Contacts, LSFactory) {
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  ConversationsFactory.getConversations()
    .then(function(res){
      var accountsList = getAccountIdsFromConversations(res.data, LSFactory.getData('currentUser', true).id)
      Contacts.getNumbersFromAccountsIds(accountsList)
        .then(function(response){
          var conversations = response.data;
          Contacts.getAllContacts().then(function(allContacts){            
            addNamesToConversations(conversations, allContacts)
          }, function(err){}) 
          //$scope.conversations = response.data;
        }, function(err){
          //console.log(err)
        });
    })

})

.controller('conversationCtrl', function($scope, LSFactory, $http, configuration, $rootScope, ContactFactory, $stateParams, ConversationFactory, ConversationMessagesFactory){

    //$scope.user = LSFactory.getData('currentUser', true)
    //$scope.messages = []    

    /*ContactFactory.getContactByConversationId($stateParams.conversationId)
      .then(function(res){
        $scope.contact = res.data;
      })*/

    //ConversationFactory.joinRoom($stateParams.conversationId);

    /*ConversationMessagesFactory.getConversationMessages($stateParams.conversationId)
      .then(function(res){
        $scope.messages = res.data;

        $scope.$watch("messages", function(){
          //$('.conversation-div').scrollTop($('.conversation-div').height())
          //$("#message-input").focus();
        })
      })*/    

    /*$scope.newMessage = {message: '', room: $stateParams.conversationId, sender: LSFactory.getData('currentUser', true).id}
    
    $scope.sendMessage = function(newMessage){
      ConversationFactory.sendMessage(newMessage);
      //$rootScope.socket.emit('message', newMessage);
      $scope.newMessage.message = '';
      //$('.conversation-div').scrollTop($('.conversation-div').height())
      //$("#message-input").focus();  
    }

    $scope.back = function(){
      ConversationFactory.leaveRoom($stateParams.conversationId);
      //$rootScope.socket.emit('leave', $stateParams.conversationId);
      //$location.path('/conversations');
    } 

    $rootScope.socket.on('message', function(msg){
      $scope.$apply(function(){
        $scope.messages.push(msg)
      })    
    })*/
  })

function cleanContactsPhoneNumbers(allContacts){
  var iteratedContacts = {} 
  iteratedContacts.list = []       
  for(var i = allContacts.length - 1; i >= 0; i--){
     for(var j = allContacts[i].phoneNumbers.length - 1; j >= 0; j--){
        allContacts[i].phoneNumbers[j].value = allContacts[i].phoneNumbers[j].value.replace(/[- )(]/g,'')
        iteratedContacts.list.push(allContacts[i].phoneNumbers[j].value);
     } 
  }
  return iteratedContacts;  
}

function addAccountsIdsToContacts(allContacts, phoneNumbersWithAccountsIds){
  for(var i = allContacts.length - 1; i >= 0; i--){
     for(var j = allContacts[i].phoneNumbers.length - 1; j >= 0; j--){
        for(var x in phoneNumbersWithAccountsIds){
          if( allContacts[i].phoneNumbers[j].value == phoneNumbersWithAccountsIds[x].phone){
            allContacts[i]._id = phoneNumbersWithAccountsIds[x]._id;
            delete phoneNumbersWithAccountsIds[x];
          }
        }        
     } 
  }
}

function addNamesToConversations(conversations, allContacts){
  console.log(conversations)
  console.log(allContacts)
  for(var i = conversations.length -1; i >= 0; i--){
    for (var j = allContacts.length - 1; j >= 0; j--) {
      for(var x in allContacts[j].phoneNumbers){
        console.log(conversations[i].phone)
        console.log(allContacts[j].phoneNumbers[x])
        if(conversations[i].phone == allContacts[j].phoneNumbers[x]){
          conversations[i].name = allContacts[j].displayName;
        }
      }
      allCjntacts[j]
    }
  }
}

function getAccountIdsFromConversations(conversations, userId){
  var acc = {}
  acc.list = []
  for(var x in conversations){
    for(var y in conversations[x].conversationPartners){
      if(conversations[x].conversationPartners[y] != userId){
        acc.list.push(conversations[x].conversationPartners[y])
      }
    }    
  }
  return acc;
}