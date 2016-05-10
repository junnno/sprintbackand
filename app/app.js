'use strict';

// Defining Angular app model with all other dependent modules
angular.module('sprint',['backand','angularMoment','ui.materialize','ngRoute','sprint.controllers','sprint.services'])

.config(function($routeProvider, $locationProvider, $httpProvider, BackandProvider) {
	BackandProvider.setAppName('sprintbackand');
   BackandProvider.setSignUpToken('b4befb93-5615-4cc0-b8b5-33fa1588e4ea');
  BackandProvider.setAnonymousToken('643c461a-1fc6-4a66-b277-8f929b92bf73');
  BackandProvider.runSocket(true);

	
	// Declaration of the default route if neither of the controllers
	// is supporting the request path
	$routeProvider.otherwise({ redirectTo: '/login'});
	
	$routeProvider.when('/login', {
		controller: 'LoginController as login',
		templateUrl: 'components/views/loginView.html'
	});
	
	$routeProvider.when('/home', {
		controller: 'HomeController',
		templateUrl: 'components/views/homeView.html'
	});
	
		$routeProvider.when('/signup', {
		controller: 'SignUpController as vm',
		templateUrl: 'components/views/signup.html'
	});
	
		$routeProvider.when('/logs', {
		controller: 'LogsController',
		templateUrl: 'components/views/logsView.html'
	});
	
	$routeProvider.when('/courses', {
		controller: 'CoursesController',
		templateUrl: 'components/views/coursesView.html'
	});
	
	$routeProvider.when('/courses/:courseId', {
		controller: 'FileController',
		templateUrl: 'components/views/filesView.html'
	});
	
	$routeProvider.when('/settings', {
		controller: 'SettingsController',
		templateUrl: 'components/views/settingsView.html'
	});
	
	
});
