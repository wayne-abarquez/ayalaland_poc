(function () {
    'use strict';

    angular.module('demoApp.home')
        .controller('boundariesController', ['Boundaries', 'boundariesService', 'gmapServices', 'placesServices', '$mdSidenav', '$timeout', boundariesController]);

    function boundariesController(Boundaries, boundariesService, gmapServices, placesServices, $mdSidenav, $timeout) {
        var vm = this;

        var polygon,
            circle;

        vm.showBoundary = showBoundary;
        vm.expandCallback = expandCallback;

        initialize();

        /* Controller Functions here */

        function initialize() {
            boundariesService.loadBoundaries()
                .then(function (list) {
                    vm.boundaries = angular.copy(list);
                }, function (error) {
                    console.log('failed to load: ', error);
                });
        }

        function showBoundary(brgy) {
            var item = Boundaries.cast(brgy);

            $('md-list-item#' + item.id.toString() + ' md-progress-circular').show();

            item.customGET('circle')
                .then(function(response){
                    console.log('get boundary detail: ', response.plain());

                    showPolygon(response.geometry);

                    gmapServices.fitToBoundsByPolygon(polygon);

                    item.type = response.type;

                    //$mdSidenav('boundariesInfoSidenav').open();
                })
                .finally(function () {
                    $timeout(function () {
                        $('md-list-item#' + item.id.toString() + ' md-progress-circular').hide();
                    }, 1000);
                });
        }

        function showPolygon (latLngArray) {
            //var latLngArray = gmapServices.setlatLngArrayToLatLngObjects(latLngArrayParam);
            //console.log('latlng array>: ',latLngArray);

            if (polygon) {
                polygon.setPath(latLngArray);
                return;
            }

            polygon = gmapServices.createPolygon(latLngArray, '#ff0000');
        }

        function expandCallback (item, event) {
            event.stopPropagation();

            if (item.isExpanded === false) return;

            if (item.typeid < 7) {
                if (item.hasOwnProperty('children') && item.children.length) return;

                $('v-pane#' + item.id.toString() + ' v-pane-header md-progress-circular').show();

                item.children = [];

                $('v-pane#'+item.id.toString()+' v-pane-content v-accordion').children().html('');

                boundariesService.loadBoundaries(item.id)
                    .then(function (list) {
                        if (list.length) item.children = angular.copy(list);
                    }, function (error) {
                        console.log('failed to load: ', error);
                    })
                    .finally(function () {
                        $timeout(function () {
                            $('v-pane#' + item.id.toString() + ' v-pane-header md-progress-circular').hide();
                        }, 1000);
                    });

                return;
            }

            showBoundary(item);

            return;
        }

    }
}());