'use strict';

angular.module('myApp.registration', ['ngRoute'])
	
	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/registration', {
			templateUrl: 'registration/registration.html',
			controller: 'RegistrationCtrl',
			isLogin: true
		});
	}])

	.service('registrationService', [function($scope){
		var players = firebase.database().ref('Players/');
		var service = {};

		service.editPlayer = function(player, key){
			players
				.child(key)
				.update(player)
		}

		service.deletePlayer = function(key){
			//delete all associations too?...
			players
				.child(key)
				.remove()
		}
		return service;
	}])
	.controller('RegistrationCtrl', ['$scope', '$firebaseArray', '$q', 'registrationService', function($scope, $firebaseArray, $q, registrationService){
		var players = firebase.database().ref('Players/');
		var myPlayers;
		var myCurrentPlayers = {}
		//function to count players in group
		
		var	getPlayers = function(){
		var deferred = $q.defer();
		$scope.editPlayerFlag = false;

		players
			.orderByChild('Groups/' + localStorage.getItem('uid'))
			.equalTo(true)
			.on('value', function(snap){
				myPlayers = snap.val();
				$scope.$broadcast('playerUpdated', myPlayers)
				deferred.resolve(myPlayers)
			})
			return deferred.promise;
		}




		getPlayers().then(function(players){
			$scope.myCurrentPlayers = players;
			if(players){
				myPlayers = Object.keys(players).length;
			}
		});
		

		$scope.addPlayer = function(){
			if (myPlayers < 4){
				console.log('name:', $scope.player);
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
				alert('Maximum players reached in your group.');
			};
		}

		$scope.toggleEditForm = function(key){
			if (key){
				$scope.key = key;
				$scope.editPlayer = {
					name: $scope.myCurrentPlayers[$scope.key].Name,
					handicap: $scope.myCurrentPlayers[$scope.key].Handicap

				}
			}
			$scope.editPlayerFlag = !$scope.editPlayerFlag;
			console.log('editPlayer:', $scope.editPlayer)
		}

		$scope.$on('playerUpdated', function(e, data){
			$scope.myCurrentPlayers = data;
		});

		$scope.submitEditForm = function(){
			var newPlayer = {
				Name : $scope.editPlayer.name,
				Handicap : $scope.editPlayer.handicap,
				Scores : $scope.myCurrentPlayers[$scope.key].Scores,
				Tournaments : $scope.myCurrentPlayers[$scope.key].Tournaments,
				Groups : $scope.myCurrentPlayers[$scope.key].Groups
			};
			registrationService.editPlayer(newPlayer, $scope.key);
			$scope.editPlayerFlag = false;
		}

		$scope.deletePlayer = function(key){
			registrationService.deletePlayer(key);
		};

	}])