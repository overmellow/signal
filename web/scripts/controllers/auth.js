angular.module('myApp')
	.controller('loginCtrl', function($scope, $rootScope, AuthFactory, LSFactory, $location){
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
		$scope.signup = function(newUser){
			AuthFactory.signup(newUser)
				.then(function(res){
					$location.path('/')
				})
		}		
	})
	.controller('logoutCtrl', function($scope, $rootScope, LSFactory, $location, $window){
		LSFactory.removeData('currentUser');
		delete $rootScope.user;
		delete $scope.user;
		LSFactory.removeData('token');
		$location.path('/');
		$window.location.reload();
	})
	.controller('profileCtrl', function($scope, $rootScope, AuthFactory, LSFactory, $location){
		$scope.user = LSFactory.getData('currentUser', true)

		$scope.updateProfile = function(user){
			AuthFactory.updateProfile(user)
				.then(function(err, res){
					$location.path('/')
				})
		}				
	})	