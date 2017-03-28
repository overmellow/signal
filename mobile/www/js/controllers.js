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
  //$ionicNavBarDelegate.showBackButton(false);

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

.controller('signinAuthcodeCtrl', function($scope, $state, LSFactory, AuthFactory, $location) {
  $scope.user = LSFactory.getData('signinUser', true)

  $scope.signinAuthcode = function(user){
    AuthFactory.signin(user)
      .then(function(res){
        LSFactory.setData('currentUser', res.data.user, true);
        //$rootScope.user = res.data.user;
        LSFactory.setData('token', res.data.token);
        LSFactory.removeData('signinUser')
        $state.go('tab.chats')
      }, function(err){
        $scope.notification = err.data;
      })
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('contactsCtrl', function($scope, $stateParams, Contacts) {
  $scope.$on("$ionicView.enter", function(event, data){
    Contacts.getAllContacts().then(function(allContacts){
      
      var contactsNumbers = cleanContactsPhoneNumbers(allContacts)
      Contacts.getContactsAccountsIds(contactsNumbers)
        .then(function(res){
          addAccountsIdsToContacts(allContacts, res.data)
          console.log(allContacts)
        }, function(err){
          console.log(err)
        });

      $scope.contacts = allContacts
    }, function(err){})
  });
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
        for(var obj in phoneNumbersWithAccountsIds){
          if( allContacts[i].phoneNumbers[j].value == phoneNumbersWithAccountsIds[obj].phone){
            allContacts[i]._id = phoneNumbersWithAccountsIds[obj]._id;
          }
        }        
     } 
  }
}
