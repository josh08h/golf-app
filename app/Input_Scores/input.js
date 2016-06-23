'use strict';

angular.module('myApp.inputScores', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/input', {
			templateUrl: 'Input_Scores/input.html',
			controller: 'inputScoresCtrl',
			isLogin: true
		});
	}])
		

	.service('scoreService', ['$q', function($q){
			
		var service = {};

// -----------------------------------------------------------------
		service.addScores = function(scoreFormData){
				console.log('form data: ',scoreFormData);
				for (var key in scoreFormData){
					firebase.database().ref('Scores/').push(scoreFormData[key]);
				};
			};

		return service;
		}]) // end of service


	.controller('inputScoresCtrl', ['$scope', '$q', 'scoreService', function($scope, $q, scoreService){
		
		var holes = firebase.database().ref('Holes/');
		var players = firebase.database().ref('players/');
		var tournaments = firebase.database().ref('Tournaments/');
		var scores = firebase.database().ref('Scores/');
		$scope.myPlayers = []
		$scope.addScore = false
		$scope.scoreFormData = {}

// ------------------------------------------------------------ initialisation functions
		var playersFnc = function(){
			var myPlayers = [];
			var deferred = $q.defer();

			players
				.orderByChild('groupID')
				.equalTo(localStorage.getItem('uid'))
				.on('value', function(snapshot){
					myPlayers.push(snapshot.val());
					deferred.resolve(myPlayers);
				});
			return deferred.promise;
		};


		var holesFnc = function(){
			var myHoles = [];
			var deferred = $q.defer();

			holes
				.orderByChild('CourseId')
				.equalTo('Burstead')
				.once('value', function(snapshot){
					myHoles.push(snapshot.val());
					deferred.resolve(myHoles);
				});
			return deferred.promise;
		};

//	------------------------------------------------------------ instantiating


// Get players in my group then for each player
// get the scores associated to them
		playersFnc().then(function(players){
			
			var deferred = $q.defer();
			var myPlayersObj = players[0];

			for (var key in myPlayersObj){
				scores.orderByChild('PlayerId').equalTo(key).on('value', function(snapshot){
					// myPlayersObj[key].scores = snapshot.val();
					myPlayersObj[key].scores = snapshot.val()
				});
			};
			$scope.myPlayers = myPlayersObj;
		});

// get holes
		holesFnc().then(function(holes){
			$scope.myHoles = holes[0];
		});

// --------------------------------------------------------------- turn object to array function
		var toArray = function(obj){
			return Object.keys(obj).map(function(key) {return obj[key]});
		}

// --------------------------------------------------------------- html onClick functions

		$scope.submitForm = function(){
			scoreService.addScores($scope.scoreFormData);
			$scope.hideForm();
		};

		$scope.hideForm = function(){
			$scope.addScore = false
		}

		$scope.showForm = function(hole){
			$scope.addScore = true;
			$scope.hole = hole;
		}

	}]) // end of controller()