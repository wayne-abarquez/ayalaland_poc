(function () {
    'use strict';

    angular
        .module('demoApp', [
            'restangular',
            'LocalStorageModule',
            'ngMaterial',
            'ngAnimate',
            'oitozero.ngSweetAlert',
            'ngMessages',
            'ngFileUpload',
            'vAccordion',
            'md.data.table',
            'angularMoment',
            'smDateTimeRangePicker',
            'ngMaterialDateRangePicker',
            'demoApp.home'
        ])

        .constant('APP_NAME', 'Ayala Land')
        .constant('BASE_URL', window.location.origin)

        .constant('SBU_SELECTION', [
            'AVIDA',
            'SLMG',
            'ALP'
        ])

        .config(['RestangularProvider', function (RestangularProvider) {
            //set the base url for api calls on our RESTful services
            var baseUrl = window.location.origin + '/api';
            RestangularProvider.setBaseUrl(baseUrl);
        }])

        .config(function (localStorageServiceProvider) {
            localStorageServiceProvider
                .setPrefix('AYALALAND')
                .setStorageType('sessionStorage')
                .setNotify(true, true)
            ;
        })

        .config(function ($mdThemingProvider) {
            //    $mdThemingProvider.theme('default')
            //        .primaryPalette('red')
            //        .accentPalette('pink');
            $mdThemingProvider.theme('docs-dark', 'default')
                .primaryPalette('yellow')
                .dark();
        })

        .run(function (userSessionService, $rootScope) {
            userSessionService.userLogin()
                .then(function (user) {
                    $rootScope.currentUser = angular.copy(user);
                });
        })

        .filter('underscoreless', function () {
            return function (input) {
                return input.replace(/_/g, ' ');
            };
        })
    ;

}());

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
};

