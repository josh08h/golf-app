'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'Login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', 'localStorageService', function($scope, localStorageService){
	var key = 'loggedIn'
	var val = false;
	// if (firebase.auth().currentUser){
	// 	$scope.showLoginFields = false;
	// } else {
	// 	$scope.showLoginFields = true;
	// }
	$scope.loggedIn = localStorageService.get('loggedIn');

	$scope.login = function(){
		var email = $scope.user.email,
				password = $scope.user.password;	
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(ref){
			//Successful login.
			val = true;
			localStorageService.set(key, val);
			$scope.loggedIn = true;
			//ADDED THIS TO REFRESH WATCHERS
			$scope.$digest();
		}).catch(function(err){
			console.log(err.code);
		});
	};

	$scope.logout = function(){
		firebase.auth().signOut().then(function(){
			val = false;
			localStorageService.set(key, val);
			$scope.loggedIn = false;
			//ADDED THIS TO REFRESH WATCHERS
			$scope.$digest();
		});
	};
}]);