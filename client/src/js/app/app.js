(function () {
    'use strict';

    angular
        .module('demoApp', [
            'restangular',
            'ngMaterial',
            'ngMessages',
            'vAccordion',
            'ngAnimate',
            'oitozero.ngSweetAlert',
            'demoApp.home'
        ])

        .constant('APP_NAME', 'Demo App')
        .constant('BASE_URL', window.location.origin)

        .config(['RestangularProvider', function (RestangularProvider) {
            //set the base url for api calls on our RESTful services
            var baseUrl = window.location.origin + '/api';
            RestangularProvider.setBaseUrl(baseUrl);
        }])

        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('red')
                .accentPalette('pink');
        });

}());

