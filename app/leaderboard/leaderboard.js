'use strict';

angular.module('myApp.leaderboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'Leaderboard/leaderboard.html',
    controller: 'LeaderboardCtrl'
  });
}])

.controller('LeaderboardCtrl', ['$scope', function($scope) {
	$scope.players = [
		{
			name: 'Josh',
			hole: 18,
			handicap: 16,
			scratch: 72,
			points: 23
		},
		{
			name: 'Ed',
			hole: 18,
			handicap: 16,
			scratch: 72,
			points: 23
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
			points: 23
		}
	]
}]);