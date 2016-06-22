'use strict';

angular.module('myApp.inputScores', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/input', {
			templateUrl: 'Input_Scores/input.html',
			controller: 'inputScoresCtrl',
			isLogin: true
		});
	}])

	// .service('scoreService', ['$q', function($q){
	// 	var service = {}

	// 	service.holes = firebase.database().ref('Holes/');
	// 	service.players = firebase.database().ref('players/');
	// 	service.tournaments = firebase.database().ref('Tournaments/');
	// 	service.scores = firebase.database().ref('Scores/');

	// 	service.refreshLeaderboard = function(){
	// 		var deferred = $q.defer();
			
	// 		service.players
	// 			.orderByChild('groupID')
	// 			.equalTo(localStorage.getItem('uid'))
	// 			.once('once', function(snapshot){
	// 				var myPlayers = []

	// 				// snapshot.forEach(function(data){
	// 				// 	myPlayers.push(data);
	// 				// 	console.log('data: ', data.val())
	// 				// });

					
	// 				// console.log('player snapshot: ', snapshot.val());
					
	// 				//for each player in my group, get the scores.
	// 				snapshot.forEach(function(cs){
	// 					console.log(cs);
	// 					getScores(cs, myPlayers)
	// 				});
	// 		});

		// 	function getScores(cs, myPlayers){
		// 		var myPlayers = [];
		// 		service.scores
		// 			.orderByChild('PlayerId')
		// 			.equalTo(cs.key)
		// 			.on('once', function(snap){
		// 				var player = cs.val()
		// 				player.Scores = snap.val()
		// 				player.PlayerId = cs.key
		// 				myPlayers.push(player);
		// 				console.log('myPlayers', myPlayers);
		// 				//CHECK CONSOLE.LOG HERE
		// 				// console.log('myPlayers: ', myPlayers);
		// 				deferred.resolve(myPlayers)
		// 			})
		// 	}
		// 	return deferred.promise;
		// }

	// 	service.submitScores = function(scores){
	// 		//IF YOU CONSOLE.LOG(SCORES) THERE ARE double the amount of objects than there are players?...
	// 		var deferred = $q.defer();
	// 		var scoresLength = Object.keys(scores).length
	// 		for(var i = 0; i < scoresLength; i++){
	// 			var score = scores[i]
	// 			var playerRef = service.players.child(score.PlayerId)
	// 			var tournamentRef = service.tournaments.child(score.TournamentId)
	// 			var holeRef = service.holes.child(score.HoleId)

	// 			var newScore = service.scores.push(score)
	// 			var newScoreId = newScore.key

	// 			// Update associations
	// 			playerRef.child('Scores').child(newScoreId).set(true)
	// 			holeRef.child('Scores').child(newScoreId).set(true)
	// 			tournamentRef.child('Scores').child(newScoreId).set(true)

	// 			deferred.resolve('updated')
	// 		}
	// 		return deferred.promise;
	// 	}

	// 	return service
	// }])

	.controller('inputScoresCtrl', ['$scope', '$q', function($scope, $q){
		var holes = firebase.database().ref('Holes/');
		var players = firebase.database().ref('players/');
		var tournaments = firebase.database().ref('Tournaments/');
		var scores = firebase.database().ref('Scores/');
		$scope.myPlayers = []
		$scope.addScore = false
		$scope.score = {}

		// $scope.submitScores = function(){
		// 	console.log('scope.score: ', $scope.score);
		// 	scoreService.submitScores($scope.score).then(function(d){
		// 		refreshLeaderboard();
		// 	})
		// 	$scope.score={};
		// }

		$scope.hideForm = function(){
			$scope.addScore = false
		}

		$scope.showForm = function(){
			$scope.addScore = true;
		}

		var playersFnc = function(){
			var myPlayers = [];
			var deferred = $q.defer();

			players
				.orderByChild('groupID')
				.equalTo(localStorage.getItem('uid'))
				.on('value', function(snapshot){
					myPlayers.push(snapshot.val());
					deferred.resolve(myPlayers);
				});
			return deferred.promise;
		};

		// 	var scoresFunc = function($q){
		// 	var myScores = [];
		// 	var deferred = $q.defer();
		// 	scores
		// 		.orderByChild('PlayerId')
		// 		.equalTo($scope.players)
		// 		.once('value', function(snapshot){
		// 			myScores.push(snapshot.val());
		// 			deferred.resolve(myScores);
		// 		});
		// 	return deferred.promise;
		// }($q).then(function(data){
		// 	$scope.myScores = data;
		// });


		var holesFnc = function(){
			var myHoles = [];
			var deferred = $q.defer();

			holes
				.orderByChild('CourseId')
				.equalTo('Burstead')
				.once('value', function(snapshot){
					myHoles.push(snapshot.val());
					deferred.resolve(myHoles);
				});
			return deferred.promise;
		};

// Get players in my group then for each player
// get the scores associated to them
		playersFnc().then(function(players){
			$scope.myPlayers = players[0];
			players.forEach(function(playersId){
				for (var playerId in playersId){
					scores.orderByChild('PlayerId').equalTo(playerId).on('value', function(snapshot){
						console.log(snapshot.val());
					})
				}
			})
		});


		holesFnc().then(function(holes){
			$scope.myHoles = holes[0];
			console.log($scope.myHoles)
		});

// get myPlayers
// get myHoles
// for each player in myPlayers{
// scores.orderByChild('playerID').equalTo(player.ID).on('value', function(snapshot){
//  
// })
//
// }








		// holes;

		// init($q).then(function(data){
		// 	$scope.players = data;
		// });

		// $scope.addScores = function(key, hole){
		// 	$scope.addScore = true
		// 	$scope.hole = hole
		// }

		
		// function refreshLeaderboard(){
		// 	scoreService.refreshLeaderboard().then(function(data){
		// 		$scope.myPlayers = data;
		// 		$scope.hideForm()
		// 	})
		// }
		// 	refreshLeaderboard();
	}])



