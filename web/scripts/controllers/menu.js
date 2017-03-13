angular.module('myApp')
  .controller('menuCtrl', function ($scope, LSFactory, $rootScope) {
		if(LSFactory.getData('currentUser') != null || LSFactory.getData('currentUser') != undefined){
			$scope.user = LSFactory.getData('currentUser', true)
		}
  });