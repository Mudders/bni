'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives','ajoslin.mobile-navigate','ngMobile'])
    .config(function ($compileProvider){
        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/homeView.html', controller: 'HomeCtrl'});
        $routeProvider.when('/view1', {templateUrl: 'partials/chaptersView.html'});
        $routeProvider.when('/view2', {templateUrl: 'partials/searchByIndustry.html'});
        $routeProvider.when('/view3/:id', {templateUrl: 'partials/membersView.html', controller: 'MembersCtrl'});
        $routeProvider.when('/view4/:id', {templateUrl: 'partials/memberDetailView.html', controller: 'MemberDetailCtrl'});
        $routeProvider.when('/view5/:id', {templateUrl: 'partials/addMemberToContactsView.html', controller: 'AddToContactsCtrl'});
        $routeProvider.when('/view6', {templateUrl: 'partials/contactsView.html'});
        $routeProvider.when('/view7', {templateUrl: 'partials/compassView.html'});
        $routeProvider.otherwise({redirectTo: '/'});
  }]);
