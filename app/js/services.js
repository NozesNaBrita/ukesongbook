/**
 * Created by thiago on 18/10/15.
 */
var ukeSongbookServices = angular.module('ukeSongbookServices', []);

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