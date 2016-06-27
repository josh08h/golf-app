'use strict';

angular.module('myApp.registration', ['ngRoute'])
	
	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/registration', {
			templateUrl: 'registration/registration.html',
			controller: 'RegistrationCtrl',
			isLogin: true
		});
	}])

	.controller('RegistrationCtrl', ['$scope', '$firebaseArray', '$q', function($scope, $firebaseArray, $q){
		var players = firebase.database().ref('Players/');
		var myPlayers;
		//function to count players in group
		var	getPlayers = function(){
		var deferred = $q.defer();
		players
			.orderByChild('Groups/' + localStorage.getItem('uid'))
			.equalTo(true)
			.on('value', function(snap){
				myPlayers = snap.val();
				deferred.resolve(myPlayers)
			})
			return deferred.promise;
		}
		getPlayers().then(function(players){
			$scope.myCurrentPlayers = players;
			myPlayers = Object.keys(players).length;
		});
		

		$scope.addPlayer = function(){
			if (myPlayers < 4){
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
			else{
				alert('Maximum players reached in your group.')
			}

		}
	}])