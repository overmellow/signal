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
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl',
      }
    }
  })
  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })
  .state('tab.conversations', {
      url: '/conversations',
      views: {
        'tab-conversations': {
          templateUrl: 'templates/tab-conversations.html',
          controller: 'conversationsCtrl'
        }
      }
    })
  .state('tab.conversation-detail', {
    url: '/conversations/:contactId',
    views: {
      'tab-conversations': {
        templateUrl: 'templates/conversation-detail.html',
        controller: 'conversationCtrl'
      }
    }
  })
  .state('tab.contacts', {
    url: '/contacts',
    views: {
      'tab-contacts': {
        templateUrl: 'templates/tab-contacts.html',
        controller: 'contactsCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');
})

.config(function($httpProvider) {
    $httpProvider.interceptors.push(interceptor);
})
//.constant('apiUrl', 'http://192.168.74.131:3000/')

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