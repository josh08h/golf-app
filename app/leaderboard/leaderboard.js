'use strict';

angular.module('myApp.leaderboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'Leaderboard/leaderboard.html',
    controller: 'LeaderboardCtrl'
  });
}])

.controller('LeaderboardCtrl', [function() {

}]);