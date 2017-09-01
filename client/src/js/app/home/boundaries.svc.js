(function(){
'use strict';

angular.module('demoApp.home')
    .factory('boundariesService', ['Boundaries', '$q', 'Lot', boundariesService]);

    function boundariesService (Boundaries, $q, Lot) {
        var service = {};

        service.boundaries = [];

        service.loadBoundaries = loadBoundaries;
        service.uploadShapeFile = uploadShapeFile;

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

        function uploadShapeFile(file) {
            var dfd = $q.defer();

            if (!file) {
                dfd.reject();
            } else {
                file.upload = Lot.uploadShapeFile(file);

                file.upload.then(function (response) {
                    file.result = response.data;
                    dfd.resolve(response.data);
                }, function (error) {
                    dfd.reject(error);
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));

                });
            }

            return dfd.promise;
        }

        return service;
    }
}());