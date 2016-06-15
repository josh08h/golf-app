'use strict';

angular.module('myApp.inputScores', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/input', {
			templateUrl: 'Input_Scores/input.html',
			controller: 'inputScoresCtrl'
		});
	}])

	.controller('inputScoresCtrl', ['$scope', function($scope){

		
		// TEST DATA ----------------------------------------------
		$scope.myPlayers = [
		{
			name: 'Josh'
		},
		{
			name: 'Tom'
		},
		{
			name: 'Adriaan'
		},
		{
			name: 'Ed'
		}]


		$scope.courseHoles = [
		{
			number: 1,
			par: 4,
			strokeIndex: 3
		},
		{
			number: 2,
			par: 3,
			strokeIndex: 7
		},
		{
			number: 3,
			par: 4,
			strokeIndex: 12
		},
		{
			number: 4,
			par: 5,
			strokeIndex: 2
		}]

		// TEST DATA END ----------------------------------------------





	}])