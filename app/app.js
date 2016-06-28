'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'underscore',
  'myApp.leaderboard',
  'myApp.login',
  'myApp.inputScores',
  'myApp.registration',
  'firebase',
  'LocalStorageModule'
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/'});
}])
.run(function($rootScope, $location){
	$rootScope.$on('$routeChangeStart', function(event, next){
		var isAuth = localStorage.getItem('uid');
		if(!isAuth && next.isLogin){
			$location.path('/');
		};
	});
});
