(function(){
'use strict';

angular.module('demoApp.home')
    .factory('Boundaries', ['Restangular', Boundaries]);
    
    function Boundaries (Restangular) {
        var myModel = Restangular.all('boundaries');

        var resource = {
            circle: function (boundaryId) {
                return Restangular.restangularizeElement(null, boundaryId, 'circle');
            }
        };

        angular.merge(myModel, resource);

        return myModel;
    }
}());