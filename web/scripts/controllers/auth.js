angular.module('myApp')
/*	.controller('loginCtrl', function($scope, $rootScope, AuthFactory, LSFactory, $location){
		$scope.user = {}
		$scope.login = function(user){
			AuthFactory.login(user)
				.then(function(res){
					LSFactory.setData('currentUser', res.data.user, true);
					$rootScope.user = res.data.user;
					LSFactory.setData('token', res.data.token);
					$location.path('/');
				}, function(err){
					$scope.notification = err.data;
				})
			}						
	})	
	.controller('signupCtrl', function($scope, AuthFactory, $location){
		$scope.newUser = {}
		$scope.signupPhone = function(newUser){
			AuthFactory.signupPhone(newUser)
				.then(function(res){
					$location.path('/signup/authcode')
				})
		}
		$scope.signup = function(newUser){
			AuthFactory.signup(newUser)
				.then(function(res){
					$location.path('/signup/phone')
				})
		}		
	})*/

	.controller('signinCtrl', function($scope, $rootScope, AuthFactory, LSFactory, $location){
		$scope.user = {}
		$scope.signinPhone = function(user){
			AuthFactory.signinPhone(user)
				.then(function(res){
					LSFactory.setData('signinUser', user, true)
					$location.path('/signin/authcode')
				}, function(err){
					$scope.notification = err.data;
				})
		}
		$scope.signin = function(user){
			AuthFactory.signin(user)
				.then(function(res){
					LSFactory.setData('currentUser', res.data.user, true);
					$rootScope.user = res.data.user;
					LSFactory.setData('token', res.data.token);
					LSFactory.removeData('signinUser')
					$location.path('/conversations')
				}, function(err){
					console.log(err)
					$scope.notification = err.data;
				})
		}		
	})	

	.controller('logoutCtrl', function($scope, $rootScope, LSFactory, $location, $window){
		LSFactory.removeData('currentUser');
		delete $rootScope.user;
		delete $scope.user;
		LSFactory.removeData('token');
		LSFactory.removeData('signinUser');
		$location.path('/');
		$window.location.reload();
	})