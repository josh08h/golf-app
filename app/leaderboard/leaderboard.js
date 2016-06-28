'use strict';

angular.module('myApp.leaderboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'leaderboard/leaderboard.html',
    controller: 'LeaderboardCtrl'
  });
}])

.service('leaderboardService', ['$q', '$rootScope', '$timeout', function($q, $rootScope, $timeout){
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
        service.getScores(myPlayers)
			})
		}

    service.getScores = function(myPlayers) {
      var deferred = $q.defer();
      Object.keys(myPlayers).forEach(function(playerId){
        scores.orderByChild('PlayerId').equalTo(playerId).on('value', function(snapshot){
          var scores = snapshot.val();
          myPlayers[playerId].scores = scores;
          deferred.resolve(myPlayers)
          $timeout(function() {
            $rootScope.$broadcast('allScores:updated', deferred.promise);
          }, 10);
        })
      })
    }

		service.getPoints = function(hole, score, handicap){
			for (var holeKey in hole){
				for (var scoreKey in score){
					if (hole[holeKey].HoleId === score.HoleId){
						var strokeHandDiff = handicap - hole[holeKey].strokeIndex;
						var sPar;
						var points;
						var overPar;
						var retObj = {};

						if (!(isNaN(score.Score - hole[holeKey].Par))){
							retObj.overPar = score.Score - hole[holeKey].Par;
						}
						else {
							retObj.overPar = 0;
						}
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
								points = 0;
								break;
							case 1:
								points = 1;
								break;
							case 0:
								points =2;
								break;
							case -1:
								points = 3;
								break;
							case -2:
								points = 4;
								break;
							case -3:
								points = 5;
								break;
							default:
								points = 6;
						}

						retObj.points = points;
						return retObj;
					}// end if
				}
			}// end for 
		};


		service.sortPlayers = function(players){
			var sortedPlayers = service.toArray(players);
			sortedPlayers.sort(function(a,b){
				return b.totalPoints - a.totalPoints
			})
			return sortedPlayers;
		}

		service.toArray = function(obj){
			return Object.keys(obj).map(function(key) {return obj[key]});
		}

	return service;
}])

.controller('LeaderboardCtrl', ['$scope', 'leaderboardService', '_', function($scope, leaderboardService, _) {


	var getScores= function(players){
		//for each player
		for (var playerId in players){
			players[playerId].totalPoints = 0;
			players[playerId].overPar = 0;
			if (players[playerId].hasOwnProperty('scores') && players[playerId].scores != null){
				var scoresLength = Object.keys(players[playerId].Scores).length;
			}
			//for each score in player
			for (var scoreId in players[playerId].scores){
				var score = players[playerId].scores[scoreId];
				var handicap = players[playerId].Handicap;
				var hole = $scope.holes;
				players[playerId].scores[scoreId].points = leaderboardService.getPoints($scope.holes, score, handicap).points;
				players[playerId].totalPoints += leaderboardService.getPoints($scope.holes, score, handicap).points;
				players[playerId].overPar += leaderboardService.getPoints($scope.holes, score, handicap).overPar;
			}
		}
	}

	//get holes using service
	leaderboardService.getHoles().then(function(holes){
		$scope.holes = holes[0];
		leaderboardService.getPlayersWithScores()
	});

  function findLastHole (players) {
    _.each(players, function(player){
      var count = 0;
      player.lastHole = _.find(_.toArray(player.scores).reverse(), function(score) {
        if(count === 0) {
          count +=1; 
          return score;
        }
      });
    }); 
  };
		$scope.$on('allScores:updated', function(event, data) {
			data.then(function(players) {
        findLastHole(players)
				$scope.players = players
        getScores(players);
        $scope.players = leaderboardService.sortPlayers(players);
			})
		});
}]);