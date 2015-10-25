angular.module('ukeSongbookApp', [
    'ngRoute',
    'ukeSongbookServices',
    'ukeSongbookControllers',
    'ukeSongbookDirectives',
    'duScroll'
])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl'
            })
            .when('/busca', {
                templateUrl: 'partials/search.html',
                controller: 'SearchCtrl'
            })
            .otherwise({redirectTo: '/'});

        // use the HTML5 History API
        //$locationProvider.html5Mode({
        //    enabled: true,
        //    requireBase: true
        //});
    }])
    .value('duScrollDuration', 1000)
    .run(['$rootScope', function($rootScope) {
        //$rootScope.$on("$routeChangeStart", function (event, next, current) {
        //    console.log(sessionStorage.restorestate);
        //    if (sessionStorage.restorestate == "true") {
        //        $rootScope.$broadcast('restorestate'); //let everything know we need to restore state
        //        sessionStorage.restorestate = false;
        //    }
        //});
        //
        //// "The onbeforeunload event fires when the document is about to be unloaded."
        //// http://www.w3schools.com/tags/ev_onbeforeunload.asp
        //window.onbeforeunload = function (event) {
        //    $rootScope.$broadcast('savestate');
        //};
    }]);




