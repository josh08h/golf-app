'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.leaderboard',
  'myApp.login',
  'myApp.inputScores',
  'myApp.registration',
  'firebase',
  'LocalStorageModule'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/'});
}]);
