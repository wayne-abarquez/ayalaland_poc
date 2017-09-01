(function(){
'use strict';

angular.module('demoApp.home')
    .factory('boundariesService', ['Boundaries', '$q', boundariesService]);

    function boundariesService (Boundaries, $q) {
        var service = {};

        service.boundaries = [];

        service.loadBoundaries = loadBoundaries;

        function loadBoundaries (parentid) {
            var dfd = $q.defer();

            var pid = parentid || null;

            //Boundaries.getList({parent_id: pid})
            Boundaries.customGET(null, {parent_id: pid})
                .then(function (list) {
                    service.boundaries = list.map(function (item) {
                        item['isExpanded'] = false;
                        return item;
                    });

                    dfd.resolve(list);
                }, function (error) {
                    console.log('failed to load: ', error);
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        return service;
    }
}());