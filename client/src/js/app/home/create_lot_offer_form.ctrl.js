(function () {
    'use strict';

    angular.module('demoApp.home')
        .controller('createLotOfferFormController', ['$rootScope', 'modalServices', 'boundariesService', 'gmapServices', 'lotService', 'alertServices', 'drawingServices', createLotOfferFormController]);

    function createLotOfferFormController($rootScope, modalServices, boundariesService, gmapServices, lotService, alertServices, drawingServices) {
        var vm = this;

        var bounds;
        var drawSiteListener;

        vm.maxDate = new Date();

        vm.form = {};
        vm.newLot = {};

        vm.save = save;
        vm.close = close;

        vm.regionChanged = regionChanged;
        vm.provinceChanged = provinceChanged;
        vm.cityChanged = cityChanged;
        vm.drawBorder = drawBorder;

        initialize();

        function initialize() {
            // load regions typeid = 3
            boundariesService.loadBoundariesByType(3)
                .then(function(regions){
                    vm.regions = angular.copy(regions);
                });
        }

        function save() {
            //console.log('save lot offer', vm.newLot);
            lotService.saveLot(vm.newLot)
                .then(function(newLotData){
                    if (drawingServices.drawPolygon) {
                        drawingServices.drawPolygon.setMap(null);
                        drawingServices.drawPolygon = null;
                    }
                    lotService.addLot(newLotData);
                    alertServices.showSuccess('Offer for lot #'+ newLotData.id+' created successfully!');
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

        function drawBorder () {
            if (drawingServices.drawPolygon && drawingServices.drawPolygon.getMap()) {
                gmapServices.setPolygonEditable(drawingServices.drawPolygon, true);

                $rootScope.$broadcast('edit-drawing-polygon');

                drawSiteListener = $rootScope.$on('save-drawing', function (event, param) {
                    console.log('save-drawing event');
                    gmapServices.setPolygonEditable(drawingServices.drawPolygon, false);
                    vm.newLot.area = gmapServices.getLatLngArrayLiteralPolygon(drawingServices.drawPolygon);
                    console.log('lot area: ', vm.newLot.area);
                });
            } else {
                $rootScope.$broadcast('start-drawing');

                drawSiteListener = $rootScope.$on('save-area', function (event, param) {
                    console.log('save area: ', param);
                    vm.newLot.area = param.area;
                    drawingServices.drawPolygon = gmapServices.createPolygon(param.area, '#2ecc71', true);
                    console.log('lot area: ', vm.newLot.area);
                });
            }

        }
    }
}());