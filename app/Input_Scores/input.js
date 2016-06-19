'use strict';

angular.module('myApp.inputScores', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/input', {
			templateUrl: 'Input_Scores/input.html',
			controller: 'inputScoresCtrl',
			isLogin: true
		});
	}])

	.service('scoresService', ['$q', function($q){
		var service = {}

		service.holes = firebase.database().ref('Holes/');
		service.players = firebase.database().ref('Players/');
		service.tournaments = firebase.database().ref('Tournaments/');
		service.scores = firebase.database().ref('Scores/');

		service.refreshLeaderboard = function(){
			var deferred = $q.defer();
			
			service.players
				.orderByChild('Groups/GroupA')
				.equalTo(true)
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
						myPlayers.push(player)
						deferred.resolve(myPlayers)
					})
			}
			return deferred.promise;
		}

		return service
	}])

	.controller('inputScoresCtrl', ['$scope', 'scoresService', function($scope, scoresService){
		var holes = firebase.database().ref('Holes/');
		var players = firebase.database().ref('Players/');
		var tournaments = firebase.database().ref('Tournaments/');
		var scores = firebase.database().ref('Scores/');
		$scope.myPlayers = []
		$scope.addScore = false
		$scope.score = {}

		$scope.submitScores = function(){
			console.log($scope.score)
			var scoresLength = Object.keys($scope.score).length
			for(var i = 0; i < scoresLength; i++){
				var score = $scope.score[i]
				var playerRef = players.child(score.PlayerId)
				var tournamentRef = tournaments.child(score.TournamentId)
				var holeRef = holes.child(score.HoleId)

				var newScore = scores.push($scope.score[i])
				var newScoreId = newScore.key
				// Update associations

				playerRef.child('Scores').child(newScoreId).set(true)
				holeRef.child('Scores').child(newScoreId).set(true)
				tournamentRef.child('Scores').child(newScoreId).set(true)
			}
			scoresService.refreshLeaderboard().then(function(data){
				$scope.myPlayers = data;
			})
			$scope.hideForm()
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


		//MOVED TO SERVICE 

		// function refreshLeaderboard(){
		// 	players
		// 		.orderByChild('Groups/GroupA')
		// 		.equalTo(true)
		// 		.once('value', function(snapshot){
		// 			snapshot.forEach(function(cs){
		// 				getScores(cs)
		// 			})
		// 	});
		// }

		// function getScores(cs){
		// 	scores
		// 		.orderByChild('PlayerId')
		// 		.equalTo(cs.key)
		// 		.on('value', function(snap){
		// 			var player = cs.val()
		// 			player.Scores = snap.val()
		// 			player.PlayerId = cs.key
		// 			$scope.myPlayers.push(player)
		// 			$scope.$digest();
		// 		})
		// }

		scoresService.refreshLeaderboard().then(function(data){
			$scope.myPlayers = data;
		})

			// refreshLeaderboard()
	}])





