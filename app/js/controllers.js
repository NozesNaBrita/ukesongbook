/**
 * Created by thiago on 16/10/15.
 */
var ukeSongbookControllers = angular.module('ukeSongbookControllers', []);

ukeSongbookControllers.controller('MainCtrl', ['$scope', '$document', 'Song',
    function($scope, $document, Song) {

        $scope.songs = Song.list(function(data){
            console.log(data);
        });

        $scope.voteFor = function(song) {
            try {
                song.voted = !song.voted;
            } catch(e) {
                song.voted = true;
            }
            if(song.voted === true) {
                // salvar voto
            }
        }


    }]);

ukeSongbookControllers.controller('SearchCtrl', ['$scope', '$document',
    function($scope, $document) {

    }]);