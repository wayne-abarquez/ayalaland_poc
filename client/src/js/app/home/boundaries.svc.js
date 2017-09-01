(function(){
'use strict';

angular.module('demoApp.home')
    .factory('boundariesService', ['Boundaries', '$q', 'gmapServices', '$rootScope', 'placesServices', boundariesService]);

    function boundariesService (Boundaries, $q, gmapServices, $rootScope, placesServices) {
        var service = {};

        var poiInfowindow,
            poiMarkers = [];

        service.boundaries = [];

        service.loadBoundaries = loadBoundaries;
        service.loadFavoriteBoundaries = loadFavoriteBoundaries;

        service.showPOIs = showPOIs;
        service.showPOIByType = showPOIByType;
        service.hidePOIs = hidePOIs;
        service.toggleDPs = toggleDPs;
        service.loadDPs = loadDPs;
        service.showDPs = showDPs;
        service.hideDPs = hideDPs;

        function loadBoundaries (parentid) {
            var dfd = $q.defer();

            var pid = parentid || null;

            //Boundaries.getList({parent_id: pid})
            Boundaries.customGET(null, {parent_id: pid})
                .then(function (list) {
                    //console.log('list: ',list);

                    //service.boundaries = angular.copy(list);
                    service.boundaries = list.map(function (item) {
                        item['isExpanded'] = false;
                        return item;
                    });

                    dfd.resolve(list);
                }, function (error) {
                    console.log('failed to load: ', error);
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        function loadFavoriteBoundaries () {
            var dfd = $q.defer();

            Boundaries.customGET('favorites')
                .then(function(list){
                    console.log('load favorites: ',list);
                    dfd.resolve(list);
                }, function (error) {
                    console.log('failed to load: ', error);
                    dfd.reject(error);
                });
            return dfd.promise;
        }

        function showPOIs(data, selectedBoundary) {
            var marker,
                placeType;

            service.selectedBoundary = selectedBoundary;
            service.selectedBoundary.places = data;

            $rootScope.$broadcast('boundary_selected', service.selectedBoundary);

            if (!poiInfowindow) poiInfowindow = gmapServices.createInfoWindow('');

            hidePOIs();

            poiMarkers = [];

            for (var poiType in data) {
                data[poiType].forEach(function (item) {
                    placeType = placesServices.getPlaceIcon(item.type);
                    //marker = gmapServices.createMarker(item.geometry.location);
                    marker = gmapServices.createMapIconLabel(item.geometry.location, placeType.icon || 'compass', placeType.color);
                    marker.name = item.name;
                    marker.type = item.type;
                    marker.content = '<b>' + item.name + '</b>';
                    marker.content += '<br>' + marker.type;

                    gmapServices.addListener(marker, 'click', function () {
                        poiInfowindow.open(gmapServices.map, this);
                        poiInfowindow.setContent(this.content);
                    });

                    poiMarkers.push(marker);
                });
            }
        }

        function showPOIByType (type) {
            if (type == 'all') {
                poiMarkers.forEach(function (marker) {
                    if (!marker.getMap()) marker.setMap(gmapServices.map);
                });
                return;
            }

            poiMarkers.forEach(function(marker){
                if (type != marker.type) {
                    marker.setMap(null);
                    return;
                }

                if (!marker.getMap()) marker.setMap(gmapServices.map);
            })
        }

        function hidePOIs() {
            poiMarkers.forEach(function (marker) {
                if (marker && marker.getMap()) marker.setMap(null);
            });
        }

        var dpMarkers = [];

        function toggleDPs () {
            if (dpMarkers.length) {
                if (dpMarkers[0].getMap()) {
                    hideDPs();
                } else {
                    showDPs();
                }
            }
        }

        function showDPs () {
            dpMarkers.forEach(function (marker) {
                if (marker && !marker.getMap()) marker.setMap(gmapServices.map);
            });
        }

        function loadDPs(data) {
            hideDPs(true);

            var circleMarker;

            data.forEach(function(item){
                circleMarker = gmapServices.createFacilityMarker(item.geom)
                circleMarker.content = 'Facility: <b>' + item.facility + '</b>';

                gmapServices.addListener(circleMarker, 'click', function () {
                    poiInfowindow.open(gmapServices.map, this);
                    poiInfowindow.setContent(this.content);
                });

                dpMarkers.push(circleMarker);
            });
        }

        function hideDPs(clearMarkers) {
            dpMarkers.forEach(function (marker) {
                if (marker && marker.getMap()) marker.setMap(null);
            });

            if (clearMarkers === true) dpMarkers = [];
        }

        return service;
    }
}());