(function(){
'use strict';

angular.module('demoApp.home')
    .factory('lotService', ['Lot', 'gmapServices', '$q', lotService]);

    function lotService (Lot, gmapServices, $q) {
        var service = {};

        var infowindow = gmapServices.createInfoWindow('');

        var lots = [];

        service.loadLots = loadLots;
        service.addLot = addLot;
        service.saveLot = saveLot;
        service.filterLot = filterLot;

        function loadLots () {
            Lot.getList()
                .then(function(response){
                   var resp = response.plain();
                   //console.log('lots: ',resp);
                    resp.forEach(function(item){
                        addLot(item);
                    });
                });
        }

        function addLot (item) {
            //console.log('add lot: ',item);
            var polygon = gmapServices.createPolygon(item.geom, '#2ecc71', true);

            polygon = angular.merge(polygon, item);

            polygon.center = gmapServices.getPolygonCenter(polygon);

            polygon.content = '<div>';
            polygon.content += '<h4 class="no-margin text-muted padding-left-5">Project Name: ' + (item.project_name ? item.project_name : '') + '</h4>';
            polygon.content += '<h4 class="no-margin padding-left-5">Estate Name: <b>' + (item.estate_name ? item.estate_name : '') + '</b></h4>';
            polygon.content += '<h4 class="no-margin text-muted padding-left-5">SBU: ' + (item.sbu ? item.sbu : '') + '</h4>';
            polygon.content += '<h4 class="no-margin text-muted padding-left-5">Lot Status: ' + (item.lot_status ? item.lot_status : '') + '</h4>';
            /* Action Buttons */
            polygon.content += '<button id="show-lot-details-btn" data-lot-id="' + item.id + '" class="md-button md-raised">Show Details</button>';
            polygon.content += '</div>';

            gmapServices.addListener(polygon, 'click', function(e){
                infowindow.open(gmapServices.map);
                //infowindow.setPosition(e.latLng);
                infowindow.setPosition(this.center);
                infowindow.setContent(this.content);
            });

            lots.push(polygon);

            gmapServices.fitToBoundsByPolygon(polygon);
        }

        // if lotId is not null perform update otherwise perform create
        function saveLot (lotData, lotId) {
            var dfd = $q.defer();

            if (lotId) { // update
                Lot.get(lotId)
                    .customPUT(data)
                    .then(function (response) {
                        dfd.resolve(response.plain());
                    }, function (error) {
                        dfd.reject(error);
                    });
            } else { // insert
                Lot.post(lotData)
                    .then(function (response) {
                        var resp = response.plain();
                        console.log('create lot', resp);
                        addLot(resp.lot);
                        dfd.resolve(resp.lot);
                    }, function (error) {
                        dfd.reject(error);
                    });
            }

            return dfd.promise;
        }

        function filterLot (filterData) {
            var dfd = $q.defer();

            Lot.getList(filterData)
                .then(function(response){
                    var resp = response.plain();
                    console.log('filterLot result: ', resp);
                    dfd.resolve(resp);
                }, function (error){
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        return service;
    }
}());