(function(){
'use strict';

angular.module('demoApp.home')
    .factory('lotService', ['Lot', 'gmapServices', lotService]);

    function lotService (Lot, gmapServices) {
        var service = {};

        var lots = [];

        service.loadLots = loadLots;

        function loadLots () {
            Lot.getList()
                .then(function(response){
                   var resp = response.plain();
                   console.log('lots: ',resp);
                    resp.forEach(function(item){
                        addLot(item);
                    });
                });
        }

        function addLot (item) {
            var polygon = gmapServices.createPolygon(item.geom, '#2ecc71', true);
            gmapServices.fitToBoundsByPolygon(polygon);
            polygon = angular.merge(polygon, item);
            lots.push(polygon);
        }

        return service;
    }
}());