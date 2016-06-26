'use strict';

angular.module('myApp.leaderboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'Leaderboard/leaderboard.html',
    controller: 'LeaderboardCtrl'
  });
}])

.service('leaderboardService', ['$q', '$rootScope', function($q, $rootScope){
	var holes = firebase.database().ref('Holes/');
	var players = firebase.database().ref('Players/');
	var scores = firebase.database().ref('Scores/');
	var service = {};

	//get holes
	service.getHoles = function(){
		var deferred = $q.defer();
		holes
			.orderByChild('CourseId')
			.equalTo('Burstead')
			.once('value', function(snapshot){
				deferred.resolve([snapshot.val()])
			});
		return deferred.promise;
	};

	//get the players from T1 and associated scores
	service.getPlayersWithScores = function(){
		var deferred = $q.defer();
		var myPlayers = [];

		players
			.orderByChild('Tournaments/T1')
			.equalTo(true)
			.on('value', function(snap){
				myPlayers = snap.val();
				Object.keys(myPlayers).forEach(function(playerId){
					scores
						.orderByChild('PlayerId')
						.equalTo(playerId)
						.on('value', function(snap){
							var scores = snap.val();
							myPlayers[playerId].scores = scores;
							deferred.resolve(myPlayers);
							$rootScope.$broadcast('allScores:updated', deferred.promise);
						})
				})
			})
			return deferred.promise;
		}	

	return service;
}])

.controller('LeaderboardCtrl', ['$scope', 'leaderboardService', function($scope, leaderboardService) {

	//get holes using service
	leaderboardService.getHoles().then(function(holes){
		$scope.holes = holes[0];
	});

	//get all players in T1
	leaderboardService.getPlayersWithScores().then(function(players){
		$scope.players = players;
		console.log($scope.players)
		// leaderboardService.getScores(players[0]);
	});

		$scope.$on('allScores:updated', function(event, data) {
			data.then(function(players) {
				$scope.players = players
				console.log("HELLO")
			})
		});
	//write a function that takes in a player and holes
	//get player handicap
	//order player scores by hole
	//order holes by hole

}]);