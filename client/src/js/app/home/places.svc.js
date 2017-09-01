(function(){
'use strict';

angular.module('demoApp.home')
    .factory('placesServices', [placesServices]);

    function placesServices () {
        var service = {};

        service.getPlaceTypes = getPlaceTypes;
        service.getPlaceIcon = getPlaceIcon;

        var iconByplaceTypes = {
            'hospital': {
                icon: 'hospital',
                color: '#e74c3c'
            },
            'airport': {
                icon: 'airport',
                color: '#3498db'
            },
            'bank': {
                icon: 'bank',
                color: '#f1c40f'
            },
            'lodging': {
                icon: 'lodging',
                color: '#16a085'
            },
            'school': {
                icon: 'school',
                color: '#7f8c8d'
            },
            'restaurant': {
                icon: 'restaurant',
                color: '#e67e22'
            },
            'shopping_mall': {
                icon: 'department-store',
                color: '#9b59b6'
            },
            'park': {
                icon: 'park',
                color: '#2ecc71'
            },
            'church': {
                icon: 'church',
                color: '#27ae60'
            },
            'museum': {
                icon: 'museum',
                color: '#95a5a6'
            },
            'cafe': {
                icon: 'cafe',
                color: '#f39c12'
            },
            'establishment': {
                icon: 'local-government',
                color: '#7f8c8d'
            }
            //'store': {
            //    icon: 'department-store',
            //    color: '#9b59b6'
            //},
            //'food': {
            //    icon: 'restaurant',
            //    color: '#e67e22'
            //},
            //'bar': {
            //    icon: 'night-club',
            //    color: '#34495e'
            //},
            //'point_of_interest': {
            //    icon: 'point-of-interest',
            //    color: '#2ecc71'
            //}
        };

        service.defaultPlaceTypes = [
            'hospital',
            'airport',
            'bank',
            'lodging',
            'school',
            'restaurant',
            'shopping_mall'
        ];

        function getPlaceTypes () {
            var result = [];
            for (var key in iconByplaceTypes) {
                result.push(key);
            }
            return result;
        }

        function getPlaceIcon (placeType) {
            return iconByplaceTypes[placeType];;
        }

        return service;
    }
}());