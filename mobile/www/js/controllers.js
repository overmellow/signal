angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state) {
  $scope.logout = function(){
    $state.go('signin.phone')
  }
})

.controller('signinCtrl', function($scope, $state, LSFactory, AuthFactory) {
  $scope.user = {}

  $scope.signinPhone = function(user){
    console.log(user)    
    AuthFactory.signinPhone(user)
      .then(function(res){
        LSFactory.setData('signinUser', user, true)
        //$location.path('/signin/authcode')
        $state.go('signin.authcode')
      }, function(err){
        $scope.notification = err.data;
      })
  }
  $scope.signin = function(user){
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

.controller('logoutCtrl', function($scope, $state, LSFactory){
  delete $scope.user;
  LSFactory.removeData('currentUser');
  LSFactory.removeData('token');
  LSFactory.removeData('signinUser');
  $state.go('signin.phone')
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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
