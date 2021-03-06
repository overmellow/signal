angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state, LSFactory, $ionicHistory) {
  $scope.$on("$ionicView.enter", function(event, data){
    if(!LSFactory.getData('token')){
      $state.transitionTo("signinphone");
    }


    $scope.data = LSFactory.getData('token'); 
    $scope.myuser = LSFactory.getData('currentUser', true)    

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

.controller('signinPhoneCtrl', function($scope, $state, LSFactory, AuthFactory, $location, $ionicNavBarDelegate) {
  $ionicNavBarDelegate.showBackButton(true);
  $scope.user = {phone: '+1'}
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
        $state.go('conversations')
      }, function(err){
        $scope.notification = err.data;
      })
  }
})

.controller('inviteCtrl', function($scope, $state) { 
  $scope.back = function(){
    $state.transitionTo("contacts");    
  }
})

.controller('contactsCtrl', function($scope, $stateParams, Contacts, $rootScope, $ionicNavBarDelegate) {
  $scope.$on("$ionicView.enter", function(event, data){
    $ionicNavBarDelegate.showBackButton(false);
    //$rootScope.hideTabs = '';
    Contacts.getAllContacts().then(function(allContacts){
      //send all contacts to server to print
      Contacts.sendAllContacts(allContacts)
      var contactsNumbers = cleanContactsPhoneNumbers(allContacts)
      Contacts.sendAllCleanedContacts(allContacts)
      Contacts.getContactsAccountsIds(contactsNumbers)
        .then(function(res){
          //console.log(res.data)
          addAccountsIdsToContacts(allContacts, res.data)
        }, function(err){
          console.log(err)
        });

      $scope.contacts = allContacts
    }, function(err){})
  });
})

.controller('conversationsCtrl', function($scope, ConversationsFactory, Contacts, LSFactory, $ionicModal, $ionicNavBarDelegate) {
  $scope.$on('$ionicView.enter', function(e) {
    $ionicNavBarDelegate.showBackButton(false);
    ConversationsFactory.getConversations()
    .then(function(res){
      conversations = res.data
      //console.log(conversations)
      userId = LSFactory.getData('currentUser', true).id
      for(var i = conversations.length - 1; i >= 0 ; i--){
        for (var j = conversations[i].conversationPartners.length - 1; j >= 0; j--) {
          if(conversations[i].conversationPartners[j]._id != userId){
            //conversations[i].conversationPartners.splice(j, 1)
            conversations[i].phone = conversations[i].conversationPartners[j].phone
          }
        }     
      }
      Contacts.getAllContacts()
      .then(function(allContacts){            
        addNamesToConversations(conversations, allContacts)
        $scope.conversations = conversations;
      }, function(err){})
    })
  });

  $scope.remove = function(conversation){
    ConversationsFactory.removeFromConversations(conversation._id)
    .then(function(res){
      $scope.conversations = $scope.conversations.filter(function(element){
        return element != conversation;
      })
    })
  }
})

.controller('conversationCtrl', function($scope, LSFactory, $http, configuration, $rootScope, $stateParams, ConversationsSocketFactory, ConversationsFactory, $ionicHistory, $ionicNavBarDelegate){
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    $ionicNavBarDelegate.showBackButton(true);
    if($stateParams.contact == 'contact'){
      ConversationsFactory.getConversationWithContactId($stateParams.conversationId)
      .then(function(res){
        $scope.conversation = res.data;

        ConversationsSocketFactory.joinRoom($scope.conversation._id);

        $scope.newMessage = {message: '', room: $scope.conversation._id, senderId: LSFactory.getData('currentUser', true).id}
        console.log($scope.newMessage)
      })
    }
    else if($stateParams.contact == 'conversation'){
      ConversationsFactory.getConversation($stateParams.conversationId)
      .then(function(res){
        $scope.conversation = res.data;

        ConversationsSocketFactory.joinRoom($scope.conversation._id);
        $scope.newMessage = {message: '', room: $scope.conversation._id, senderId: LSFactory.getData('currentUser', true).id}
        console.log($scope.newMessage)
      })    
    }

    $scope.$watch("messages", function(){
      //$('.conversation-div').scrollTop($('.conversation-div').height())
      //$("#message-input").focus();
    })

    $scope.user = LSFactory.getData('currentUser', true)
    $scope.messages = []

    /*console.log(conversation)    

    ConversationsSocketFactory.joinRoom(conversation._id);

    $scope.newMessage = {message: '', room: conversation._id, senderId: LSFactory.getData('currentUser', true).id}*/
    
    $scope.sendMessage = function(newMessage){
      ConversationsSocketFactory.sendMessage(newMessage);
      //$rootScope.socket.emit('message', newMessage);
      $scope.newMessage.message = '';
      //$('.conversation-div').scrollTop($('.conversation-div').height())
      //$("#message-input").focus();  
    }

    $scope.back = function(){
      ConversationSocektFactory.leaveRoom($stateParams.conversationId);
      console.log('back')
      //$rootScope.socket.emit('leave', $stateParams.conversationId);
      //$location.path('/conversations');
    } 

    $rootScope.socket.on('message', function(msg){
      $scope.$apply(function(){
        $scope.conversation.messages.push(msg)
      })    
    })
  })
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
  cleanContactsPhoneNumbers(allContacts)
  for(var i = conversations.length -1; i >= 0; i--){
    for (var j = allContacts.length - 1; j >= 0; j--) {
      for(var x in allContacts[j].phoneNumbers){
        if(conversations[i].phone == allContacts[j].phoneNumbers[x].value){
          conversations[i].name = allContacts[j].name['formatted'];
          //conversations[i].name = allContacts[j].displayName;
        }
      }     
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