'use strict';

angular.module('myApp.inputScores', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/input', {
			templateUrl: 'Input_Scores/input.html',
			controller: 'inputScoresCtrl',
			isLogin: true
		});
	}])

	.service('scoreService', ['$q', '$rootScope', function($q, $rootScope){
			
		var service = {};

// -----------------------------------------------------------------
		service.addScores = function(scoreFormData){
				console.log('form data: ',scoreFormData);
				for (var key in scoreFormData){
					firebase.database().ref('Scores/').push(scoreFormData[key]);
				};
			};

			service.playersFnc = function(players){

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

			service.getScores = function(myPlayers) {
				var scores = firebase.database().ref('Scores/');
				var deferred = $q.defer();
				Object.keys(myPlayers).forEach(function(playerId){
					scores.orderByChild('PlayerId').equalTo(playerId).on('value', function(snapshot){
						var scores = snapshot.val();
						console.log('scores: ', scores);
						myPlayers[playerId].scores = scores;
						console.log(myPlayers)
						deferred.resolve(myPlayers)
						$rootScope.$broadcast('scores:updated', deferred.promise);
					})
				})
				
				deferred.resolve(myPlayers)
				return deferred.promise;
			}

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
		scoreService.playersFnc(players).then(function(players){
			var myPlayers = players[0];
			scoreService.getScores(myPlayers).then(function (data) {
				$scope.myPlayers = data
			});
		});

		$scope.$on('scores:updated', function(event, data) {
			data.then(function(players) {
				$scope.myPlayers = players
			})
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
			debugger
			scoreService.addScores($scope.scoreFormData);
			$scope.scoreFormData = {}
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

.filter('with', function() {
  return function(items, field) {
        var result = '';
        angular.forEach(items, function(value, key) {
            if (value.HoleId === field) {
                result = value.Score;
            }
        });
        return result;
    };
});