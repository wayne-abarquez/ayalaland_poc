(function () {
    'use strict';

    angular.module('demoApp')
        .controller('mainController', ['$rootScope', 'APP_NAME', '$mdSidenav', mainController]);

    function mainController($rootScope, APP_NAME, $mdSidenav) {
        var vm = this;

        $rootScope.showBoundaryDetailBtn = false;
        $rootScope.appName = APP_NAME;
        $rootScope.showGRDPPanel = false;

        vm.showBoundaryDetail = showBoundaryDetail;

        function showBoundaryDetail () {
            $mdSidenav('boundariesInfoSidenav')
                .open()
                .then(function () {
                    $rootScope.showBoundaryDetailBtn = false;
                    $rootScope.showGRDPPanel = true;
                });
        }
    }
}());
