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
		var holes = firebase.database().ref('Holes/');
		var players = firebase.database().ref('Players/');
		// var groups = firebase.database().ref('Groups/');
		var scores = firebase.database().ref('Scores/');
		$scope.myPlayers = []

		holes
			.orderByChild('CourseId')
			.equalTo('Burstead')
			.once('value', function(snapshot){
				$scope.courseHoles = snapshot.val()
				console.log(snapshot.val())
				$scope.$digest();
			})

		players
			.orderByChild('Groups/GroupA')
			.equalTo(true)
			.on('value', function(snapshot){
				snapshot.forEach(function(cs){
					getScores(cs)
				})
			});

		function getScores(cs){
			scores
				.orderByChild('PlayerId')
				.equalTo(cs.key)
				.on('value', function(snap){
					var player = cs.val()
					player.Scores = snap.val()
					$scope.myPlayers.push(player)
					$scope.$digest();
				})
		}

			// $scope.sortScores = function(player){
			// 	debugger
			// }

	}])





