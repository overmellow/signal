// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.factories', 'starter.configuration', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, configuration, LSFactory, $state, $location) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.socket = io.connect(configuration.apiUrl, {
    //query: 'token=' + LSFactory.getData('token')
    });

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {      
      var token = LSFactory.getData('token');        
      if (!token) {

        var signinUser = LSFactory.getData('signinUser');
        if(!signinUser && toState.name != 'signinphone') {
            $state.transitionTo("signinphone");
            event.preventDefault(); 
        }
        else {}
      }
    })
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('signinphone', {
    url: '/phone',
    templateUrl: 'templates/auth/phone.html',   
    controller: "signinPhoneCtrl"
  })
  .state('signinauthcode', {
    url: '/authcode',
    templateUrl: 'templates/auth/authcode.html',
    controller: "signinAuthcodeCtrl"
  })
  .state('invite', {
    url: '/invite',
    templateUrl: 'templates/invite.html',
    controller: "inviteCtrl"
  })
  /*.state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })*/
  .state('dash', {
    url: '/dash',
    /*views: {
      'tab-dash': {*/
        templateUrl: 'templates/dash.html',
        controller: 'DashCtrl',
      /*}
    }*/
  })
  .state('conversations', {
      url: '/conversations',
      /*views: {
        'tab-conversations': {*/
          templateUrl: 'templates/conversations.html',
          controller: 'conversationsCtrl'
        /*}
      }*/
    })
  .state('conversation-detail', {
    url: '/conversations/:conversationId/:contact',
    /*views: {
      'tab-conversations': {*/
        templateUrl: 'templates/conversation.html',
        controller: 'conversationCtrl'
      /*}
    }*/
  })
  .state('contacts', {
    url: '/contacts',
    /*views: {
      'tab-contacts': {*/
        templateUrl: 'templates/contacts.html',
        controller: 'contactsCtrl'
      /*}
    }*/
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/dash');
})

.config(function($httpProvider) {
    $httpProvider.interceptors.push(interceptor);
})
//.constant('apiUrl', 'http://192.168.74.131:3000/')

//angular.module('app.directives', []);
.directive('hideTabs', function($rootScope) {
  return {
    restrict: 'A',
    link: function($scope, $el) {
      $rootScope.hideTabs = 'tabs-item-hide';
      $scope.$on('$destroy', function() {
          $rootScope.hideTabs = '';
      });
    }
  };
})

.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {

      $timeout(function() {
        element[0].focus(); 
      }, 2000);
    }
  };
})

var interceptor = function($q, LSFactory){  
  return {
    request: function(config){
      var token = LSFactory.getData('token');
      if(token){
        config.headers['x-access-token'] = LSFactory.getData('token');
      }     
      return config;
    },
  }
};