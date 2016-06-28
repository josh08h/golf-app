'use strict';

angular.module('myApp.inputScores', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/input', {
			templateUrl: 'Input_Scores/input.html',
			controller: 'inputScoresCtrl',
			isLogin: true
		});
	}])

	.service('scoreService', ['$q', '$rootScope', '$timeout', function($q, $rootScope, $timeout){
			
		var service = {};


		service.holes = firebase.database().ref('Holes/');
		service.players = firebase.database().ref('Players/');
		service.tournaments = firebase.database().ref('Tournaments/');
		service.scores = firebase.database().ref('Scores/');


// -----------------------------------------------------------------
		service.addScores = function(scoreFormData){
				console.log('form data: ',scoreFormData);
				for (var key in scoreFormData){
					var score = scoreFormData[key]
					var playerRef = service.players.child(score.PlayerId)
					var tournamentRef = service.tournaments.child(score.TournamentId)
					var holeRef = service.holes.child(score.HoleId)

					var newScore = service.scores.push(score)
					var newScoreId = newScore.key

					// Update associations
					playerRef.child('Scores').child(newScoreId).set(true)
					holeRef.child('Scores').child(newScoreId).set(true)
					tournamentRef.child('Scores').child(newScoreId).set(true)
				};
			};

			service.updateScores = function(scoreFormData){
				console.log('form data: ',scoreFormData);
				for (var key in scoreFormData){
					var score = scoreFormData[key]		
					service.scores.child(key).update(score)
				};
			};

			service.getHoles = function(){
			var myHoles = [];
			var deferred = $q.defer();

			service.holes
				.orderByChild('CourseId')
				.equalTo('Burstead')
				.once('value', function(snapshot){
					deferred.resolve([snapshot.val()]);
				});
			return deferred.promise;
		};

		service.refreshLeaderboard = function(){
			var myPlayers = [];
			var deferred = $q.defer();

			service.players
				.orderByChild('Groups/' + localStorage.getItem('uid'))
				.equalTo(true)
				.on('value', function(snapshot){
					var players = snapshot.val();
					service.getScores(players)			
				});
		};

			service.getScores = function(myPlayers) {
				var deferred = $q.defer();
				Object.keys(myPlayers).forEach(function(playerId){
					service.scores.orderByChild('PlayerId').equalTo(playerId).on('value', function(snapshot){
						var scores = snapshot.val();
						myPlayers[playerId].scores = scores;
						deferred.resolve(myPlayers)
						$timeout(function() {
							$rootScope.$broadcast('scores:updated', deferred.promise);
						}, 10);
					})
				})
			}

		return service;
		}]) // end of service


	.controller('inputScoresCtrl', ['$scope', '$q', 'scoreService', '_', function($scope, $q, scoreService, _){
		$scope.myPlayers = []
		$scope.addScore = false
		$scope.updateScore = false
		$scope.scoreFormData = {}

//	------------------------------------------------------------ instantiating


// Get players in my group then for each player
// get the scores associated to them
	scoreService.refreshLeaderboard()

	$scope.$on('scores:updated', function(event, data) {
		data.then(function(players) {
			$scope.myPlayers = players
		})
	});

// get holes
	scoreService.getHoles().then(function(holes){
		$scope.myHoles = holes[0];
	});

// --------------------------------------------------------------- turn object to array function
		var toArray = function(obj){
			return Object.keys(obj).map(function(key) {return obj[key]});
		}

// --------------------------------------------------------------- html onClick functions

		$scope.submitForm = function(){
			scoreService.addScores($scope.scoreFormData);
			$scope.scoreFormData = {}
			$scope.hideForm();
		};

		$scope.updateScores = function(){
			console.log($scope.scoreFormData)
			scoreService.updateScores($scope.scoreFormData);
			$scope.scoreFormData = {};
			$scope.hideForm();
		};

		$scope.hideForm = function(){
			$scope.addScore = false;
			$scope.updateScore = false;
		}

		function checkForUpdate(hole, players) {
			$scope.scoreFormData = {}
			var scoresFound = false;
			_.each(players, function(value,key){
			  _.each(value.scores, function(v, k){
			   if(v.HoleId === hole.HoleId) {
			   	scoresFound = true;
			   	$scope.scoreFormData[k] = v
			   }
			 })
			})
			return scoresFound
		}

		$scope.showForm = function(hole){
			if(checkForUpdate(hole, $scope.myPlayers)) {
				$scope.updateScore = true;
				$scope.hole = hole;
			} else {
				$scope.addScore = true;
				$scope.hole = hole;
			}
			
		}

	}]) // end of controller()

.filter('orderByObject', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
})

.filter('with', function() {

  function filter(items, field) {
        var result = '';
        angular.forEach(items, function(value, key) {
            if (value.HoleId === field) {
                result = value.Score;
            }
        });
        return result;
    };

    return function(items, field){
    	if (items === undefined){
    		return 'loading...';
    	}
    	else{
    		return filter(items, field);
    	};
    };
});