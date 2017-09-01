(function () {
    'use strict';

    angular.module('demoApp.home')
        .factory('Lot', ['Restangular', 'Upload', Lot]);

    function Lot(Restangular, Upload) {
        var myModel = Restangular.all('lots');

        var resource = {

            cast: function (myid) {
                return Restangular.restangularizeElement(null, {id: myid}, 'lots');
            },

            uploadShapeFile: function (fileParam) {
                var uploadUrl = myModel.getRestangularUrl() + '/' + 'upload';
                return Upload.upload({
                    url: uploadUrl,
                    method: 'POST',
                    data: {file: fileParam}
                });
            }
        };

        angular.merge(myModel, resource);

        return myModel;
    }
}());