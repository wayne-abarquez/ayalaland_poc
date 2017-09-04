(function () {
    'use strict';

    angular.module('demoApp.reports')
        .factory('Issue', ['Restangular', Issue]);

    function Issue(Restangular) {
        var myModel = Restangular.all('issues');

        var resource = {

            cast: function (myid) {
                return Restangular.restangularizeElement(null, {id: myid}, 'issues');
            }
        };

        angular.merge(myModel, resource);

        return myModel;
    }
}());