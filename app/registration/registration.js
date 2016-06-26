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
			firebase.database().ref('Players/').push({
				'Name': $scope.player.name,
				'Handicap':$scope.player.handicap,
				'Groups':{[localStorage.getItem('uid')] : true},
				'Tournaments': {'T1': true}
			}).then(function(player){
				firebase.database().ref('Tournaments/T1/Players').child(player.key).set(true)
				firebase.database().ref('Tournaments/T1/Groups').child(localStorage.getItem('uid')).set(true)
				firebase.database().ref('Groups/' + localStorage.getItem('uid')).child('TournamentId').set('T1')
				firebase.database().ref('Groups/' + localStorage.getItem('uid') + '/Players').child(player.key).set(true)
				$scope.player.name = '';
				$scope.player.handicap = '';
				$scope.$apply();
			});
		}
	}])