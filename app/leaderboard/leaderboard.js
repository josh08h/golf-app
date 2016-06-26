'use strict';

angular.module('myApp.leaderboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'Leaderboard/leaderboard.html',
    controller: 'LeaderboardCtrl'
  });
}])

.service('leaderboardService', ['$q', function($q){
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
						})
				})
			})
			return deferred.promise;
		}	

			// players
			// .orderByChild('Tournaments/T1')
			// .equalTo(true)
			// .on('value', function(snapshot){
			// 	myPlayers = snapshot.val();
			// 	Object.keys(myPlayers[0]).forEach(function(playerId){
			// 	scores
			// 		.orderByChild('PlayerId')
			// 		.equalTo(playerId)
			// 		.on('value', function(snapshot){
			// 				var scores = snapshot.val();
			// 				players[playerId].scores = scores;
			// 				deferred.resolve(players);
			// 		})
			// 	}
			// }




	// var	getPlayers = function(){
	// 	players
	// 		.orderByChild('Tournaments/T1')
	// 		.equalTo(true)
	// 		.on('value', function(snapshot){
	// 			myPlayers = snapshot.val();
	// 			Object.keys(myPlayers[0]).forEach(function(playerId){
	// 			scores
	// 				.orderByChild('PlayerId')
	// 				.equalTo(playerId)
	// 				.on('value', function(snapshot){
	// 						var scores = snapshot.val();
	// 						players[playerId].scores = scores;
	// 						deferred.resolve(players);
	// 				})
	// 			})
	// 		})
	// 	}
	// 	return deferred.promise;
	// }


	// //get all players in T1
	// service.getPlayers = function(){
	// 	var deferred = $q.defer();
	// 	players
	// 		.orderByChild('Tournaments/T1')
	// 		.equalTo(true)
	// 		.on('value', function(snapshot){
	// 			deferred.resolve([snapshot.val()])
	// 		});
	// 		return deferred.promise;
	// };

	// //get the scores and append to players object.
	// service.getScores = function(players){
	// 	Object.keys(players).forEach(function(playerId){
	// 		scores
	// 			.orderByChild('PlayerId')
	// 			.equalTo(playerId)
	// 			.on('value', function(snapshot){
	// 				var scores = snapshot.val();
	// 				players[playerId].scores = scores;
	// 			})
	// 	})
	// }

	return service;
}])

.controller('LeaderboardCtrl', ['$scope', 'leaderboardService', function($scope, leaderboardService) {

	//get holes using service
	leaderboardService.getHoles().then(function(holes){
		$scope.holes = holes[0];
	});

	//get all players in T1
	leaderboardService.getPlayersWithScores().then(function(players){
		$scope.players = players[0];
		console.log(players)
		// leaderboardService.getScores(players[0]);
	});



	//get players and their scores

	//write a function that takes in a player and holes
	//get player handicap
	//order player scores by hole
	//order holes by hole

}]);