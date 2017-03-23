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

    $rootScope.$on('$stateChangeStart', function (event, next) {      
      var token = LSFactory.getData('token');        
      if (!token) {
        console.log('token')

        var signinUser = LSFactory.getData('signinUser');
        if(!signinUser) {
            $location.path('/signin/phone');
          } else{
            $location.path('/signin/authcode');
        }
      }
    })

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/auth/signin.html',
    controller: 'signinCtrl'
  })

  .state('signin.phone', {
    url: '/phone',
    templateUrl: 'templates/auth/phone.html',   
  })

  .state('signin.authcode', {
    url: '/authcode',
    templateUrl: 'templates/auth/authcode.html',
  })

  .state('logout', {
    url: '/logout',
    template: ' ',
    controller: "logoutCtrl"
  })
  // setup an abstract state for the tabs directive
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
        controller: 'DashCtrl'
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
      console.log(token)
      if(token){
        //config.headers['x-access-token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7ImNvbnRhY3RzIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJwYXNzd29yZCI6ImluaXQiLCJlbWFpbCI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfX3YiOnRydWUsImNvbnRhY3RzIjp0cnVlLCJwYXNzd29yZCI6dHJ1ZSwiZW1haWwiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7InNhdmUiOltudWxsLG51bGxdLCJpc05ldyI6W251bGwsbnVsbF19LCJfZXZlbnRzQ291bnQiOjIsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7ImNvbnRhY3RzIjpbeyJjb250YWN0ZWUiOiI1OGE0YTRjYmU4YTdkZjEyYzYzZGFmNzciLCJjb25maXJtZWQiOmZhbHNlLCJjb252ZXJzYXRpb25JZCI6IjU4YWUwM2VjNzc4OTVkODhkZDM5NzE1YSIsIl9pZCI6IjU4YWUwM2VjNzc4OTVkODhkZDM5NzE1YiJ9XSwiX192IjoxMzYsInBhc3N3b3JkIjoiMjAwMCIsImVtYWlsIjoibW9yaUBtYWlsLmNvbSIsIl9pZCI6IjU4YTQ4YzhmMWY0NzMxMTBlOTIzYWUxNCJ9LCJfcHJlcyI6eyIkX19vcmlnaW5hbF9zYXZlIjpbbnVsbCxudWxsXSwiJF9fb3JpZ2luYWxfdmFsaWRhdGUiOltudWxsXSwiJF9fb3JpZ2luYWxfcmVtb3ZlIjpbbnVsbF19LCJfcG9zdHMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W10sIiRfX29yaWdpbmFsX3ZhbGlkYXRlIjpbXSwiJF9fb3JpZ2luYWxfcmVtb3ZlIjpbXX0sImlhdCI6MTQ4ODQ5MjAzMH0.54KdY1z9D-nMSAOA2Z2u68Zjp6zcT8x1eCkhu9MAja4';
        config.headers['x-access-token'] = LSFactory.getData('token');
      }     
      return config;
    },
  }
};
