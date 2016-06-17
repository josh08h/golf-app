'use strict';

angular.module('myApp.inputScores', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/input', {
			templateUrl: 'Input_Scores/input.html',
			controller: 'inputScoresCtrl',
			isLogin: true
		});
	}])

	.controller('inputScoresCtrl', ['$scope', function($scope){
		
		var players = firebase.database().ref('players/');
		
		players.orderByChild('groupID')
			.equalTo(localStorage.getItem('uid'))
			.on('value', function(snapshot){
				$scope.myPlayers = snapshot.val();
				$scope.$digest();
			});

	}])





