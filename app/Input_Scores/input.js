'use strict';

angular.module('myApp.inputScores', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/input', {
			templateUrl: 'Input_Scores/input.html',
			controller: 'inputScoresCtrl',
			isLogin: true
		});
	}])

	.controller('inputScoresCtrl', ['$scope', function($scope){
		var holes = firebase.database().ref('Holes/');
		var players = firebase.database().ref('Players/');
		var tournaments = firebase.database().ref('Tournaments/');
		// var groups = firebase.database().ref('Groups/');
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
				debugger
				// Update associations
				// playerRef.child('Scores').push({
				// 	newScoreId: true
				// })
				// holeRef.child('Scores').push({
				// 	newScoreId: true
				// })
				tournamentRef.update({
					"Scores":{
						newScoreId: true
					}
				})
			}
		}

		$scope.showForm = function(){
			$scope.addScore = false
		}

		$scope.addScores = function(key, hole){
			$scope.addScore = true
			$scope.holeId = key
			$scope.hole = hole
		}

		holes
			.orderByChild('CourseId')
			.equalTo('Burstead')
			.once('value', function(snapshot){
				$scope.courseHoles = snapshot.val()
		});


		function refreshLeaderboard(){
			players
				.orderByChild('Groups/GroupA')
				.equalTo(true)
				.once('value', function(snapshot){
					snapshot.forEach(function(cs){
						getScores(cs)
					})
			});
		}

		function getScores(cs){
			scores
				.orderByChild('PlayerId')
				.equalTo(cs.key)
				.on('value', function(snap){
					var player = cs.val()
					player.Scores = snap.val()
					player.PlayerId = cs.key
					$scope.myPlayers.push(player)
					$scope.$digest();
				})
		}

			refreshLeaderboard()
	}])





