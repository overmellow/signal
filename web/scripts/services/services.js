angular.module('myApp')
.factory("LSFactory", function($window, $rootScope) {
	return {
		setData: function(key, val, stringify = false) {
			if(stringify)
			{
				val = JSON.stringify(val);
			}			
		  $window.localStorage && $window.localStorage.setItem(key, val);
		  return this;
		},
		getData: function(key, stringify = false) {
			if(stringify)
			{
				return JSON.parse($window.localStorage && $window.localStorage.getItem(key))
			}
			return $window.localStorage && $window.localStorage.getItem(key);
		},
		removeData: function(key) {
		  return $window.localStorage && $window.localStorage.removeItem(key);
		}
	};
})