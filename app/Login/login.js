'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'Login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$location', function($scope, $location){

	//set observer on Auth object.
	//use $digest to refresh watchers in angular.
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $scope.loggedIn = true;
	    $scope.$digest();	
	    //already stored in local storage but hard to get with key
	    //so store using localStorage.
	    var uid = user.uid;
			localStorage.setItem('uid', uid);
	  } else {
	    $scope.loggedIn = false;
	    $scope.loggedInUser = null;
	    $scope.$digest();
	    localStorage.removeItem('uid');
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
		$location.path("/");
	};

}]);

