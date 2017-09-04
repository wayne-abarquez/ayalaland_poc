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
            'ngMaterialDateRangePicker',
            'demoApp.home',
            'demoApp.reports'
        ])

        .constant('APP_NAME', 'Ayala Land')
        .constant('BASE_URL', window.location.origin)

        .constant('SBU_SELECTION', [
            'AVIDA',
            'SLMG',
            'ALP'
        ])

        .constant('LOT_STATUS_SELECTION', [
            'ACTIVE',
            'FOR DUE DILIGENCE',
            'DUE DILIGENCE IN PROGRESS',
            'DUE DILIGENCE COMPLETED',
            'FOR IC APPROVAL',
            'ACQUIRE'
        ])

        .constant('LEGAL_STATUS_SELECTION', [
            'OK',
            'WITH ISSUE',
            'LDD IN PROGRESS',
            'LDD COMPLETED'
        ])

        .constant('TECHNICAL_STATUS_SELECTION', [
            'OK',
            'WITH ISSUE',
            'TDD IN PROGRESS',
            'TDD COMPLETED'
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

        .filter('capitalize', function () {
            return function (input) {
                if (input.indexOf(' ') !== -1) {
                    var inputPieces,
                        i;

                    input = input.toLowerCase();
                    inputPieces = input.split(' ');

                    for (i = 0; i < inputPieces.length; i++) {
                        inputPieces[i] = capitalizeString(inputPieces[i]);
                    }

                    return inputPieces.toString().replace(/,/g, ' ');
                }
                else {
                    input = input.toLowerCase();
                    return capitalizeString(input);
                }

                function capitalizeString(inputString) {
                    return inputString.substring(0, 1).toUpperCase() + inputString.substring(1);
                }
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

Object.flatten = function (ob) {
    var toReturn = {};

    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) == 'object') {
            var flatObject = Object.flatten(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
};
