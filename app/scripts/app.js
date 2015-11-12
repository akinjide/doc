/**
* @module [myApp: Main]
*
* @description [Setter: inject all dependencies]
*/
angular.module('myApp', ['ui.router', 'ngMaterial', 'ngCookies', 'angular-loading-bar']);

/**
 * @description [configuration: RouterProvider, loadingBar and locationProvider]
 */
angular.module('myApp').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'cfpLoadingBarProvider', function($stateProvider, $urlRouterProvider, $locationProvider, cfpLoadingBarProvider){
  $urlRouterProvider.otherwise("/404/notfound");
  
  $stateProvider
    .state('404', {
      url: "/404/notfound",
      templateUrl: "../partials/404.partial.html"
    })    
    .state('sm-signin', {
      url: "/sc-wd-598/signin",
      templateUrl: '../partials/sm-signin.partial.html'
    })
    .state('home', {
      url: "/",
      templateUrl: "../partials/home.partial.html",
    })
    .state('adddocument', {
      url: "/documents/add",
      templateUrl: "../partials/adddoc.partial.html",
    })
    .state('editdocument', {
      url: "/documents/edit",
      templateUrl: "../partials/editdoc.partial.html",
    })
    .state('documents', {
      url: "/documents",
      templateUrl: "../partials/docs.partial.html",
    })
    .state('profile', {
      url: "/profile",
      templateUrl: "../partials/profile.partial.html",
    })
    .state('editprofile', {
      url: "/profile/edit",
      templateUrl: "../partials/editprofile.partial.html",
    });

  $locationProvider.html5Mode(true);
}]);

/**
 * [description]
 * @param     {[module]}    $http     [$http for HTTP requests]
 * @param     {[module]}    $cookies) [save information into user browser
 */
angular.module('myApp').run([
  '$http', 
  '$cookies',
  function($http, $cookies) {
    var token = $cookies.get('uT');
    $http.defaults.headers.common['x-access-token'] = token;
}]);