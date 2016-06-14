'use strict';

angular.module('myApp.leaderboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'Leaderboard/leaderboard.html',
    controller: 'LeaderboardCtrl'
  });
}])

.controller('LeaderboardCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
	$scope.players = [
		{
			name: 'Josh',
			hole: 18,
			handicap: 16,
			scratch: 72,
			points: 34
		},
		{
			name: 'Ed',
			hole: 18,
			handicap: 16,
			scratch: 72,
			points: 26
		},
		{
			name: 'Tom',
			hole: 18,
			handicap: 16,
			scratch: 72,
			points: 23
		},
		{
			name: 'Adriaan',
			hole: 18,
			handicap: 16,
			scratch: 72,
			points: 13
		}
	];

	var ref = firebase.database().ref();

	$scope.players = $firebaseArray(ref);



}]);