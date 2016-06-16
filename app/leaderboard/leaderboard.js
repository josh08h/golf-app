'use strict';

angular.module('myApp.leaderboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'Leaderboard/leaderboard.html',
    controller: 'LeaderboardCtrl'
  });
}])

.controller('LeaderboardCtrl', ['$scope', function($scope) {



	var test = firebase.database().ref('players/').on('value', function(snapshot){
		//TURN OBJECT TO ARRAY THEN APPLY TO SCOPE.

		$scope.players = snapshot.val();
	});


}]);