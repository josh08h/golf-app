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
					var players = snapshot.val();
					deferred.resolve([snapshot.val()]);
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
					deferred.resolve([snapshot.val()]);
				});
			return deferred.promise;
		};



//	------------------------------------------------------------ instantiating


    // Get players in my group then for each player
    // get the scores associated to them
		playersFnc().then(function(players){
			var myPlayersObj = players[0];



		// Second Way-------------------
		//The problem is that the .on is only getting applied to the last in the loop.
		//however when controller refreshed (click navbar addplayer then back to mygroup)
		//the .on gets applied to all the players.
			for (var i = 0; i<Object.keys(myPlayersObj).length; i++){
				var key = Object.keys(myPlayersObj)[i];
					debugger;
				scores.orderByChild('PlayerId').equalTo(key).on('value', function(snapshot){
					debugger;
					var scores = snapshot.val();
					console.log('scores: ', scores);
					myPlayersObj[key].scores = scores;
					console.log(myPlayersObj)
				})
			}


			// First Way-------------------

			for (var key in myPlayersObj){
				console.log(key)
				scores.orderByChild('PlayerId').equalTo(key).on('value', function(snapshot){
					// myPlayersObj[key].scores = snapshot.val();
					var scores = snapshot.val();
					console.log('scores: ', scores);
					myPlayersObj[key].scores = scores;
					console.log('playersObj:',myPlayersObj);
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