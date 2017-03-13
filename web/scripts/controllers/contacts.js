angular.module('myApp')
	.controller('contactsCtrl', function($scope, ContactFactory, LSFactory, NotificationFactory, $location){
		ContactFactory.getContacts()
			.then(function(res){
				$scope.contacts = res.data;
				//$scope.notification = NotificationFactory.latestNotification();
			})

		$scope.addToMyContacts = function(contact){
			ContactFactory.addToMyContacts(contact)
			.then(function(res){
				NotificationFactory.addNotification(res.data.message);
				$location.path('/conversations');
			})			
		}
	})
	.controller('myContactsCtrl', function($scope, ContactFactory, LSFactory, NotificationFactory, $location){
		ContactFactory.getMyContacts()
			.then(function(res){
				$scope.contacts = res.data;
				console.log(res.data)
				//$scope.notification = NotificationFactory.latestNotification();
			})
		$scope.removeFromMyContacts = function(contact){
			ContactFactory.removeFromMyContacts(contact)
			.then(function(res){
				NotificationFactory.addNotification(res.data.message);
				$location.path('/contacts');
			})			
		}		
	})	