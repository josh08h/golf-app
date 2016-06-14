'use strict';

angular.module('myApp.registration', ['ngRoute'])
	
	.config(['routeProvider', function($routeProvider){
		$routeProvider.when('/registration', {
			templateUrl: 'registration/registration.html',
			controller: 'RegistrationCtrl'
		});
	}])

	.controller('RegistrationCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray){
		var ref = firebase.database().ref();
		$scope.players = $firebaseArray(ref);

		$scope.addPlayer = function(){
			$scope.players.$add({
				name: $scope.player.name,
				handicap: $scope.player.handicap
			}).then(function(ref){
				consol.log(ref);
				$scope.player.name = '';
				$scope.player.handicap = '';
			})
		}


	}])