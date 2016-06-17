'use strict';

angular.module('myApp.registration', ['ngRoute'])
	
	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/registration', {
			templateUrl: 'registration/registration.html',
			controller: 'RegistrationCtrl',
			isLogin: true
		});
	}])

	.controller('RegistrationCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray){
		// /users/$uid
		// /courses/$courseName
		// var testData = {
		// 	"players" : {
		// 		"Josh": {
		// 			'handicap': 18
		// 		},
		// 		"Tom": {
		// 			'handicap': 26
		// 		},
		// 		"Ed": {
		// 			'handicap': 22
		// 		}
		// 	},
		// 	"course" : {
		// 		'burstead': {
		// 			'hole 1': {
		// 				'par': 4,
		// 				'si':14
		// 			},
		// 			'hole 2': {
		// 				'par': 5,
		// 				'si':12
		// 			},
		// 			'hole 3': {
		// 				'par': 4,
		// 				'si':5
		// 			}
		// 		}
		// 	}
		// }

		$scope.addPlayer = function(){
			console.log('players/' + $scope.player.name);
			firebase.database().ref('players/' + $scope.player.name).set({
				'handicap':$scope.player.handicap,
				'groupID':localStorage.getItem('uid')
			});
		}
	}])