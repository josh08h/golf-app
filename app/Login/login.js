'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'Login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray){
		if (firebase.auth().currentUser){
			$scope.showLoginFields = false;
		} else {
			$scope.showLoginFields = true;
		}


	var alterNavbar = function(){
		$scope.showLoginFields = !$scope.showLoginFields;
	}
	


	$scope.login = function(){
		var email = $scope.user.email,
				password = $scope.user.password;
		firebase.auth().signInWithEmailAndPassword(email, password).then(alterNavbar).catch(function(err){
			console.log(err);
		});
	};

	$scope.logout = function(){
		console.log('logging out')
		firebase.auth().signOut().then(alterNavbar);
	};
}]);