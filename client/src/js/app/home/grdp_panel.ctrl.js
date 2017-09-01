(function(){
'use strict';

angular.module('demoApp.home')
    .controller('grdpPanelController', ['$rootScope', grdpPanelController]);

    function grdpPanelController ($rootScope) {
        var vm = this;

        vm.boundary = null;
        vm.region = '';

        function initialize () {
            $rootScope.$on('boundary_selected', function (e, data) {
                vm.boundary = angular.copy(data);
                $rootScope.showGRDPPanel = true;

                vm.region = vm.boundary.grdp[Object.keys(vm.boundary.grdp)[0]][0].boundary;
            });
        }

        initialize();
    }
}());