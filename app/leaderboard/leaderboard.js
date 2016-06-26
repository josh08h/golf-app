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

		service.getPoints = function(hole, score, handicap){
			for (var holeKey in hole){
				for (var scoreKey in score){
					if (hole[holeKey].HoleId === score.HoleId){
						var strokeHandDiff = handicap - hole[holeKey].strokeIndex;
						var sPar;
						var points;
						if (0<=strokeHandDiff && strokeHandDiff<18){
							sPar = hole[holeKey].Par + 1;
						}
						else if (strokeHandDiff<0){
							sPar = hole[holeKey].Par;
						}
						else if (strokeHandDiff>=18 && strokeHandDiff<36){
							var modHC = strokeHandDiff-18;
							if (hole[holeKey].strokeIndex<=modHC){
								sPar = hole[holeKey].Par + 2;
							}
							else {
								sPar = hole[holeKey].Par + 1;
							}
						}

						var diff = score.Score-sPar;
						switch (diff){
							case 2:
								points = 1;
								break;
							case 1:
								points = 2;
								break;
							case 0:
								points =3;
								break;
							case -1:
								points = 4;
								break;
							case -2:
								points = 5;
								break;
							case -3:
								points = 6;
								break;
							default:
								points = 0;
						}

						return points;
					}// end if
				}
			}// end for 
		};


	return service;
}])

.controller('LeaderboardCtrl', ['$scope', 'leaderboardService', function($scope, leaderboardService) {


	var getScores= function(players){
		//for each player
		for (var playerId in players){
			if (players[playerId].hasOwnProperty('scores') && players[playerId].scores != null){
				var scoresLength = Object.keys(players[playerId].Scores).length;
			}
			//for each score in player
			for (var scoreId in players[playerId].scores){
				var score = players[playerId].scores[scoreId];
				var handicap = players[playerId].Handicap;
				var hole = $scope.holes;
				players[playerId].scores[scoreId].points = leaderboardService.getPoints($scope.holes, score, handicap);
			}
		}
	}

	//get holes using service
	leaderboardService.getHoles().then(function(holes){
		$scope.holes = holes[0];
	});

	//get all players in T1
	leaderboardService.getPlayersWithScores().then(function(players){
		$scope.players = players;
		getScores(players);
		// leaderboardService.getScores(players[0]);
	});

		$scope.$on('allScores:updated', function(event, data) {
			data.then(function(players) {
				$scope.players = players
			})
		});
	//write a function that takes in a player and holes
	//get player handicap
	//order player scores by hole
	//order holes by hole

}]);