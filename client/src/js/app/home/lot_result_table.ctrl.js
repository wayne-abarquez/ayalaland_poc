(function(){
'use strict';

angular.module('demoApp.home')
    .controller('lotResultTableController', ['$rootScope', lotResultTableController]);

    function lotResultTableController ($rootScope) {
        var vm = this;

        var lotsTemp = [];

        vm.close = close;

        initialize();

        function initialize () {
            $rootScope.$on('show-lot-filter-result', function (e, params) {
                if (params.result) vm.lots = angular.copy(params.result);
            });
        }

        function close () {
            lotsTemp = angular.copy(vm.lots);
            vm.lots = [];
        }

    }
}());