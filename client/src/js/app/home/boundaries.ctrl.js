(function () {
    'use strict';

    angular.module('demoApp.home')
        .controller('boundariesController', ['Boundaries', 'boundariesService', 'gmapServices', 'placesServices', '$mdSidenav', '$timeout', boundariesController]);

    function boundariesController(Boundaries, boundariesService, gmapServices, placesServices, $mdSidenav, $timeout) {
        var vm = this;

        var polygon,
            circle;

        var foundTypeIndex,
            index = -1,
            isSelected;

        var selectedTypes = [];

        vm.favoriteBoundaries = [];

        vm.showBoundariesPanel = false;

        vm.showBoundary = showBoundary;
        vm.toggleType = toggleType;
        vm.expandCallback = expandCallback;

        vm.toggleBoundariesPanel = toggleBoundariesPanel;

        initialize();

        /* Controller Functions here */

        function initialize() {
            boundariesService.loadFavoriteBoundaries()
                .then(function(list){
                    vm.favoriteBoundaries = angular.copy(list);
                });

            vm.placeTypes = placesServices.getPlaceTypes().map(function (type) {
                foundTypeIndex = placesServices.defaultPlaceTypes.indexOf(type);
                isSelected = false;

                // initially select default place type
                if (foundTypeIndex !== -1) {
                    selectedTypes.push(type);
                    isSelected = true;
                }

                return {
                    name: type,
                    model: isSelected
                }
            });

            boundariesService.loadBoundaries()
                .then(function (list) {
                    vm.boundaries = angular.copy(list);
                }, function (error) {
                    console.log('failed to load: ', error);
                });
        }

        function toggleBoundariesPanel () {
            vm.showBoundariesPanel = !vm.showBoundariesPanel;
        }

        function toggleType (type) {
            var val = _.findWhere(vm.placeTypes, {name: type});

            index = selectedTypes.indexOf(val.name);

            if (val.model && index === -1) {
                selectedTypes.push(val.name)
            } else if (index !== -1) {
                selectedTypes.splice(index, 1);
            }
        }

        function showBoundary(brgy) {
            var item = Boundaries.cast(brgy);

            if (!selectedTypes.length) {
                alert('Please select atleast 1 place type.');
                return;
            }

            $('md-list-item#' + item.id.toString() + ' md-progress-circular').show();

            var paramTypes = selectedTypes.join('|');

            item.customGET('circle', {place_types: paramTypes})
                .then(function(response){
                    console.log('get boundary detail: ', response);

                    showPolygon(response.geometry);

                    gmapServices.setZoomIfGreater(15);
                    gmapServices.panTo(response.center);

                    item.type = response.type;
                    item['population'] = response.population;
                    item['facilities'] = response.facilities;
                    item['grdp'] = _.groupBy(response.grdp, 'type');

                    console.log('grouped grdp: ', item['grdp']);

                    // show pois on map
                    boundariesService.showPOIs(response.places, item);
                    boundariesService.loadDPs(response.facilities);

                    $mdSidenav('boundariesInfoSidenav').open();
                })
                .finally(function () {
                    $timeout(function () {
                        $('md-list-item#' + item.id.toString() + ' md-progress-circular').hide();
                    }, 1000);
                });
        }

        function showPolygon (latLngArray) {
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