angular.module('myApp', ['ui.router'])
/*.config(function($routeProvider) {
	$routeProvider
	.when("/login", {
		templateUrl : "views/auth/login.html",
		controller : 'loginCtrl'
	})
	.when("/signup", {
		templateUrl : "views/auth/signup.html",
		controller : 'signupCtrl'
	})
	.when("/logout", {
		template : " ",
		controller : 'logoutCtrl'
	})		    		    	    
	.when("/contacts/mycontacts", {
		templateUrl : "views/contacts/mycontacts.html",
		controller : 'myContactsCtrl'
	})               
	.when("/contacts", {
		templateUrl : "views/contacts/contacts.html",
		controller : 'contactsCtrl'
	})
	.when("/profile", {
		templateUrl : "views/auth/profile.html",
		controller : 'profileCtrl'
	})  
	.when("/conversations/:conversationId", {
		templateUrl : "views/conversations/conversation.html",
		controller : 'conversationCtrl'
	})
	.when("/conversations", {
		templateUrl : "views/conversations/conversations.html",
		controller : 'conversationsCtrl'
	})    		    
	.otherwise("/conversations");
})*/
.config(function($stateProvider, $urlRouterProvider) {   
  $stateProvider
	.state("signin", {
    url: '/signin',		
		templateUrl : "views/auth/signin.html",
		controller : 'signinCtrl'
	})
	.state('signin.phone', {
    url: '/phone',		
		templateUrl : 'views/auth/phone.html',
	})
	.state("signin.authcode", {
    url: '/authcode',		
		templateUrl : "views/auth/authcode.html",
	})
	.state("logout", {
    url: '/logout',		
		template : " ",
		controller : 'logoutCtrl'
	})
	.state("conversations", {
		url: 'conversations',
		templateUrl : "views/conversations/conversations.html",
		controller : 'conversationsCtrl'
	})  
  // catch all route
  // send users to the form page 
  $urlRouterProvider.otherwise('/conversations');
})

.run(function ($rootScope, $location, LSFactory, configuration) {

	/*$rootScope.socket = io.connect(configuration.apiUrl, {
		//query: 'token=' + LSFactory.getData('token')
	});*/

  $rootScope.$on('$locationChangeStart', function (event) {
		var token = LSFactory.getData('token');

		if (!token) {

		//if (token && typeof $rootScope.currentUser === 'undefined') {
		  //event.preventDefault();
  		var signinUser = LSFactory.getData('signinUser');
		  if(!signinUser){
		  	$location.path('/signin/phone');
		  } 		  
		}
		//console.log($rootScope.user);
  });

})
.config(function($httpProvider) {
		$httpProvider.interceptors.push(interceptor);
})
//.constant('apiUrl', 'http://192.168.74.131:3000/')

var interceptor = function($q, LSFactory){	
	return {
		request: function(config){
			var token = LSFactory.getData('token');
			if(token)
			{
				config.headers['x-access-token'] = LSFactory.getData('token');
			}			
			return config;
		},
	}
};