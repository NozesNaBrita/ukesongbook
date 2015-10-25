/**
 * Created by thiago on 16/10/15.
 */
var ukeSongbookControllers = angular.module('ukeSongbookControllers', []);

ukeSongbookControllers.controller('MainCtrl', ['$scope', '$document', 'Option',
    function($scope, $document, Option) {

        $scope.options = Option.list(function(data){
            console.log(data);
        });

    }]);

ukeSongbookControllers.controller('SearchCtrl', ['$scope', '$document',
    function($scope, $document) {

    }]);