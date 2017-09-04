(function () {
    'use strict';

    angular.module('demoApp.home')
        .controller('lotDetailsModalController', ['lot', '$rootScope', '$filter', 'modalServices', 'boundariesService', 'gmapServices', 'lotService', 'alertServices', 'drawingServices', lotDetailsModalController]);

    function lotDetailsModalController(lot, $rootScope, $filter, modalServices, boundariesService, gmapServices, lotService, alertServices, drawingServices) {
        var vm = this;

        var bounds;

        vm.maxDate = new Date();

        vm.form = {};
        vm.newLot = {};

        vm.save = save;
        vm.close = close;

        vm.regionChanged = regionChanged;
        vm.provinceChanged = provinceChanged;
        vm.cityChanged = cityChanged;

        initialize();

        function initialize() {
            vm.lot = lot;

            if (vm.lot.details) {
                for (var key in vm.lot.details) {
                    if (!isNaN(vm.lot.details[key])) {
                        vm.lot.details[key] = $filter('number')(vm.lot.details[key], 2);
                    }
                }
            }

            // load regions typeid = 3
            boundariesService.loadBoundariesByType(3)
                .then(function(regions){
                    vm.regions = angular.copy(regions);
                });

            vm.lotStatusOptions = [vm.lot.lot_status];
            vm.legalStatusOptions = [vm.lot.legal_status];
            vm.technicalStatusOptions = [vm.lot.technical_status];
        }

        function save() {
            //console.log('save lot offer', vm.newLot);
            //lotService.saveLot(vm.newLot)
            //    .then(function(newLotData){
            //        if (drawingServices.drawPolygon) {
            //            drawingServices.drawPolygon.setMap(null);
            //            drawingServices.drawPolygon = null;
            //        }
            //        lotService.addLot(newLotData);
            //        alertServices.showSuccess('Offer for lot #'+ newLotData.id+' created successfully!');
            //        modalServices.hideResolveModal(newLotData);
            //    });
        }

        function close() {
            modalServices.closeModal();
        }

        function panToBoundary (boundaryId) {
            boundariesService.getBoundaryDetails(boundaryId)
                .then(function (details) {
                    bounds = gmapServices.fitToBoundsByLatLngArray(details.geometry);

                    gmapServices.reverseGeocode(bounds.getCenter())
                        .then(function(addressList){
                            if (addressList.length) vm.newLot.complete_address = addressList[0].formatted_address;
                        });
                });
        }

        function regionChanged (regionId) {
            // fit to bounds
            panToBoundary(regionId);

            // load province
            boundariesService.loadBoundaries(regionId)
                .then(function (provinces) {
                    vm.provinces = angular.copy(provinces);
                });
        }

        function provinceChanged (provinceId) {
            // fit to bounds
            panToBoundary(provinceId);

            // load cities
            boundariesService.loadBoundaries(provinceId)
                .then(function (cities) {
                    vm.cities = angular.copy(cities);
                });
        }

        function cityChanged (cityId) {
            // fit to bounds
            panToBoundary(cityId);
        }
    }
}());