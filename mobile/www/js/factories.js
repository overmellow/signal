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