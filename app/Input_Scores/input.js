'use strict';

angular.module('myApp.inputScores', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/input', {
			templateUrl: 'Input_Scores/input.html',
			controller: 'inputScoresCtrl',
			isLogin: true
		});
	}])

	.service('scoreService', ['$q', function($q){
		var service = {}

		service.holes = firebase.database().ref('Holes/');
		service.players = firebase.database().ref('players/');
		service.tournaments = firebase.database().ref('Tournaments/');
		service.scores = firebase.database().ref('Scores/');

		service.refreshLeaderboard = function(){
			var deferred = $q.defer();
			
			service.players
				.orderByChild('groupID')
				.equalTo(localStorage.getItem('uid'))
				.once('value', function(snapshot){
					var myPlayers = []

					snapshot.forEach(function(cs){	
						getScores(cs, myPlayers)
					})
			});

			function getScores(cs, myPlayers){
				service.scores
					.orderByChild('PlayerId')
					.equalTo(cs.key)
					.on('value', function(snap){
						var player = cs.val()
						player.Scores = snap.val()
						player.PlayerId = cs.key
						myPlayers.push(player);
						deferred.resolve(myPlayers)
					})
			}
			return deferred.promise;
		}

		service.submitScores = function(scores){
			//IF YOU CONSOLE.LOG(SCORES) THERE ARE double the amount of objects than there are players?...
			console.log(scores);
			var deferred = $q.defer();
			var scoresLength = Object.keys(scores).length
			for(var i = 0; i < scoresLength; i++){
				var score = scores[i]
				var playerRef = service.players.child(score.PlayerId)
				var tournamentRef = service.tournaments.child(score.TournamentId)
				var holeRef = service.holes.child(score.HoleId)

				var newScore = service.scores.push(score)
				var newScoreId = newScore.key

				// Update associations
				playerRef.child('Scores').child(newScoreId).set(true)
				holeRef.child('Scores').child(newScoreId).set(true)
				tournamentRef.child('Scores').child(newScoreId).set(true)

				deferred.resolve('updated')
			}
			return deferred.promise;
		}

		return service
	}])

	.controller('inputScoresCtrl', ['$scope', 'scoreService', function($scope, scoreService){
		var holes = firebase.database().ref('Holes/');
		var players = firebase.database().ref('players/');
		var tournaments = firebase.database().ref('Tournaments/');
		var scores = firebase.database().ref('Scores/');
		$scope.myPlayers = []
		$scope.addScore = false
		$scope.score = {}

		$scope.submitScores = function(){
			scoreService.submitScores($scope.score).then(function(d){
				refreshLeaderboard()
			})
		}

		$scope.hideForm = function(){
			$scope.addScore = false
		}

		$scope.addScores = function(key, hole){
			$scope.addScore = true
			$scope.hole = hole
		}

		holes
			.orderByChild('CourseId')
			.equalTo('Burstead')
			.once('value', function(snapshot){
				$scope.courseHoles = snapshot.val()
		});

		function refreshLeaderboard(){
			scoreService.refreshLeaderboard().then(function(data){
				$scope.myPlayers = data;
				$scope.hideForm()
			})
		}
			refreshLeaderboard();
	}])





