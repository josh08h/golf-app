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
		//To order by points I think we have to convert to obj to an array
		//to use the orderBy in ng.
		$scope.players = snapshot.val();
		$scope.$digest();
	});


}]);