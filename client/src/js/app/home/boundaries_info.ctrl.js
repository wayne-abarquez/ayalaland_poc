(function () {
    'use strict';

    angular.module('demoApp.home')
        .controller('boundariesInfoController', ['boundariesService', '$mdSidenav', '$rootScope', boundariesInfoController]);

    function boundariesInfoController(boundariesService, $mdSidenav, $rootScope) {
        var vm = this;

        vm.showPOIByType = showPOIByType;
        vm.toggleFacilities = toggleFacilities;
        vm.close = close;

        initialize();

        /* Controller Functions here */

        function initialize() {
            //$rootScope.$on('boundary_selected', function(e, data){
            //    vm.boundary = angular.copy(data);
            //
            //    var allPlaces = [];
            //    for (var k in vm.boundary.places) {
            //        vm.boundary.places[k].forEach(function(item){
            //            allPlaces.push(item);
            //        });
            //    }
            //    vm.boundary.places['all'] = allPlaces;
            //});
        }

        function showPOIByType (type) {
            boundariesService.showPOIByType(type);
        }

        function toggleFacilities () {
            boundariesService.toggleDPs();
        }

        function close() {
            $rootScope.showGRDPPanel = false;

            $mdSidenav('boundariesInfoSidenav')
                .close()
                .then(function(){
                    $rootScope.showBoundaryDetailBtn = true;
                });
        }

    }
}());