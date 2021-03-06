(function(){
'use strict';

angular.module('demoApp.home')
    .factory('Boundaries', ['Restangular', Boundaries]);
    
    function Boundaries (Restangular) {
        var myModel = Restangular.all('boundaries');

        var resource = {
            cast: function (boundaryId) {
                return Restangular.restangularizeElement(null, boundaryId, 'boundaries');
            }
        };

        Restangular.extendModel('boundaries', function (model) {
            return model;
        });

        angular.merge(myModel, resource);

        return myModel;
    }
}());