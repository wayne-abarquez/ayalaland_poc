(function(){
'use strict';

angular.module('demoApp.home')
    .factory('lotService', ['Lot', 'gmapServices', '$q', 'modalServices', lotService]);

    function lotService (Lot, gmapServices, $q, modalServices) {
        var service = {};

        var infowindow = gmapServices.createInfoWindow('');

        var lots = [];

        service.loadLots = loadLots;
        service.addLot = addLot;
        service.saveLot = saveLot;
        service.filterLot = filterLot;
        service.showLot = showLot;
        service.showLotDetails = showLotDetails;
        service.reportIssue = reportIssue

        function loadLots () {
            Lot.getList()
                .then(function(response){
                    response.plain().forEach(function(item){
                        addLot(item);
                    });
                });
        }

        function addLot (item) {
            //console.log('add lot: ',item);
            var polygon = gmapServices.createPolygon(item.geom, '#2ecc71', true);

            polygon = angular.merge(polygon, item);

            polygon.center = gmapServices.getPolygonCenter(polygon);
            //
            polygon.content = '<div>';
            polygon.content += '<h4 class="no-margin text-muted padding-left-5">Project Name: ' + (item.project_name ? item.project_name : '') + '</h4>';
            polygon.content += '<h4 class="no-margin padding-left-5">Estate Name: <b>' + (item.estate_name ? item.estate_name : '') + '</b></h4>';
            polygon.content += '<h4 class="no-margin text-muted padding-left-5">SBU: ' + (item.sbu ? item.sbu : '') + '</h4>';
            polygon.content += '<h4 class="no-margin text-muted padding-left-5">Lot Status: ' + (item.lot_status ? item.lot_status : '') + '</h4>';
            /* Action Buttons */
            polygon.content += '<button id="show-lot-details-btn" data-lot-id="' + item.id + '" class="md-button md-raised">Show Details</button>';
            polygon.content += '<button id="report-lot-issue-btn" data-lot-id="' + item.id + '" class="md-button md-raised md-warn" md-warn">Report Issue</button>';
            polygon.content += '</div>';

            gmapServices.addListener(polygon, 'click', function(e){
                console.log('lot click: ',e);
                infowindow.open(gmapServices.map);
                infowindow.setPosition(e.latLng);
                //infowindow.setPosition(this.center);
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
                        addLot(resp.lot);
                        dfd.resolve(resp.lot);
                    }, function (error) {
                        dfd.reject(error);
                    });
            }

            return dfd.promise;
        }

        function clearLots () {
            lots.forEach(function(lot){
                lot.setMap(null);
            });
            lots = [];
        }

        function filterLot (filterData) {
            var dfd = $q.defer();

            clearLots();

            Lot.getList(filterData)
                .then(function(response){
                    var resp = response.plain();

                    resp.forEach(function(item){
                       addLot(item);
                    });

                    dfd.resolve(resp);
                }, function (error){
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        function showLot (lotId) {
            var lot = _.findWhere(lots, {id: lotId});

            if (lot) {
                gmapServices.panTo(lot.center);
                gmapServices.trigger(lot, 'click', {latLng: lot.center});
            }
        }


        function showLotDetails (lotId) {
            Lot.get(lotId)
                .then(function(response){
                    var resp = response.plain();
                    console.log('get lot details id = '+lotId, resp);

                    infowindow.close();

                    lots.forEach(function (item) {
                        if (item.id != lotId) item.setMap(null);
                        else gmapServices.fitToBoundsByPolygon(item);
                    });

                    modalServices.showLotDetailsModal(resp)
                        .finally(function(){
                            console.log('modal lot details finally');
                            lots.forEach(function (item) {
                                if (item.id != lotId) {
                                    item.setMap(gmapServices.map);
                                }
                            })
                        });
                });
        }

        function reportIssue (lotId) {
            console.log('reportIssue: ', lotId);
        }

        return service;
    }
}());