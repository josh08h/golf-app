'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'Login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', function($scope){


	//set observer on Auth object.
	//use $digest to refresh watchers in angular.
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $scope.loggedIn = true;
	    $scope.$digest();
	  } else {
	    $scope.loggedIn = false;
	    $scope.$digest();
	  }
	});

	//Login function
	$scope.login = function(){
		var email = $scope.user.email,
				password = $scope.user.password;	
		firebase.auth().signInWithEmailAndPassword(email, password)
			.catch(function(err){
				console.log(err.code);
			});
	};

	//Logout function
	$scope.logout = function(){
		firebase.auth().signOut()
	};


}]);