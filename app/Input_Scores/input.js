'use strict';

angular.module('myApp.inputScores', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/input_scores', {
			templateUrl: 'Input_Scores/input.html',
			controller: 'inputScoresCtrl'
		});
	}])

	.controller('inputScoresCtrl', [function(){
		
	}])