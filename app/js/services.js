/**
 * Created by thiago on 18/10/15.
 */
var ukeSongbookServices = angular.module('ukeSongbookServices', ['ngResource']);

 // @todo como resolver a port??

ukeSongbookServices.factory('Poll', ['$resource', function($resource) {
        return $resource('http://dev.ukesongbook:3000/polls/:pollId', {}, {
            query: { method: 'GET', params: { pollId: 'polls' }, isArray: true }
        })
    }]);

ukeSongbookServices.factory('Option', ['$resource', function($resource) {
        return $resource('http://dev.ukesongbook:3000/options/:optionId', {}, {
            get: { method: 'GET', params: { optionId: 'pollId' }, isArray: false },
            list: { method: 'GET', isArray: true }
        })
    }]);


ukeSongbookServices.factory('reportRequestService', ['$rootScope', function ($rootScope) {
    var pristineModel = {
        person: {}
    };

    //var requestFormService = {
    return {
        model: angular.copy(pristineModel),
        // Futuro: guardar no sessionStorage
        //,
        //SaveState: function () {
        //    sessionStorage.requestFormService = angular.toJson(requestFormService.model);
        //},
        //RestoresState: function () {
        //    requestFormService.model = angular.fromJson(sessionStorage.requestFormService);
        //},
        clear: function () {
            //sessionStorage.clear();
            this.model = angular.copy(pristineModel);
        }
    };

    //$rootScope.$on("savestate", requestFormService.SaveState);
    //$rootScope.$on("restorestate", requestFormService.RestoresState);

    //return requestFormService;
}]);