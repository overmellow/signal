angular.module('myApp')
	.controller('conversationsCtrl', function($scope, $location, LSFactory, $http, configuration, $rootScope, ContactFactory){

		/*$rootScope.socket.on('socketid', function(socketid){
			console.log('socketid : ' + socketid)
			LSFactory.setData('socketid', socketid, true);
		})*/

		/*ContactFactory.getMyContacts()
			.then(function(res){
				$scope.contacts = res.data;
			})*/

		$scope.removeFromMyContacts = function(contact){
			ContactFactory.removeFromMyContacts(contact)
			.then(function(res){
				//NotificationFactory.addNotification(res.data.message);
				$location.path('/conversations');
			})			
		}		
	})

	.controller('conversationCtrl', function($scope, $location, LSFactory, $http, configuration, $rootScope, ContactFactory, $routeParams, ConversationFactory, ConversationMessagesFactory){
    /*var socket = io.connect('http://localhost:3000', {
    	//query: 'token=' + LSFactory.getData('token')
  	});*/
  	$scope.user = LSFactory.getData('currentUser', true)
		$scope.messages = []  	

		ContactFactory.getContactByConversationId($routeParams.conversationId)
			.then(function(res){
				$scope.contact = res.data;
			})

  	ConversationFactory.joinRoom($routeParams.conversationId);

  	ConversationMessagesFactory.getConversationMessages($routeParams.conversationId)
			.then(function(res){
				$scope.messages = res.data;

				$scope.$watch("messages", function(){
					$('.conversation-div').scrollTop($('.conversation-div').height())
					$("#message-input").focus();
				})
			})  	

		$scope.newMessage = {message: '', room: $routeParams.conversationId, sender: LSFactory.getData('currentUser', true).id, socketid : LSFactory.getData('socketid', true)}
		
		$scope.sendMessage = function(newMessage){
			ConversationFactory.sendMessage(newMessage);
		  //$rootScope.socket.emit('message', newMessage);
		  $scope.newMessage.message = '';
		  $('.conversation-div').scrollTop($('.conversation-div').height())
		  $("#message-input").focus();  
		}

		$scope.back = function(){
			ConversationFactory.leaveRoom($routeParams.conversationId);
			//$rootScope.socket.emit('leave', $routeParams.conversationId);
			$location.path('/conversations');
		}	

		$rootScope.socket.on('message', function(msg){
			$scope.$apply(function(){
				$scope.messages.push(msg)
			})		
		})
	});