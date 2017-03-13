angular.module('myApp', ["ngRoute"])
.config(function($routeProvider) {
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
	/*.when("/contacts/mycontacts", {
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
	})*/  
	.when("/conversations/:conversationId", {
		templateUrl : "views/conversations/conversation.html",
		controller : 'conversationCtrl'
	})
	.when("/conversations", {
		templateUrl : "views/conversations/conversations.html",
		controller : 'conversationsCtrl'
	})    		    
	.otherwise("/conversations");
})
.run(function ($rootScope, $location, LSFactory, configuration) {

	$rootScope.socket = io.connect(configuration.apiUrl, {
		//query: 'token=' + LSFactory.getData('token')
	});

  $rootScope.$on('$locationChangeStart', function (event) {
		var token = LSFactory.getData('token');
		if (!token && $location.$$path != '/signup') {

		//if (token && typeof $rootScope.currentUser === 'undefined') {
		  //event.preventDefault();
		  $location.path('/login');
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