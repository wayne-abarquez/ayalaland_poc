(function () {
    'use strict';

    angular.module('demoApp.home')
        .controller('lotDetailsModalController', ['lot', '$rootScope', '$filter', 'modalServices', 'boundariesService', 'gmapServices', 'lotService', 'SBU_SELECTION', 'alertServices', lotDetailsModalController]);

    function lotDetailsModalController(lot, $rootScope, $filter, modalServices, boundariesService, gmapServices, lotService, SBU_SELECTION, alertServices) {
        var vm = this;

        var bounds;

        vm.maxDate = new Date();

        vm.form = {};
        vm.lot = {};

        vm.save = save;
        vm.close = close;

        vm.regionChanged = regionChanged;
        vm.provinceChanged = provinceChanged;
        vm.cityChanged = cityChanged;

        initialize();

        function initialize() {
            vm.lot = lot;

            $rootScope.$watch('currentUser', function (newValue) {
                if (!newValue) return;
                vm.currentUser = newValue;

                vm.lotStatusOptions = lotService.getLotStatusSelectionByRole(vm.currentUser.role, vm.lot.lot_status);
                vm.legalStatusOptions = lotService.getLegalStatusSelectionByRole(vm.currentUser.role, vm.lot.legal_status, vm.lot.lot_status);
                vm.technicalStatusOptions = lotService.getTechnicalStatusSelectionByRole(vm.currentUser.role, vm.lot.technical_status, vm.lot.lot_status);
            });

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

            vm.sbuSelection = SBU_SELECTION;
        }

        function save() {
            delete vm.lot.geom;

            lotService.saveLot(vm.lot, vm.lot.id)
                .then(function(newLotData){
                    alertServices.showSuccess('Offer for lot #'+ newLotData.id+' updated successfully!');
                    modalServices.hideResolveModal(newLotData);
                });
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
                            if (addressList.length) vm.lot.complete_address = addressList[0].formatted_address;
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