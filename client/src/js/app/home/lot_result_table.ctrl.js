(function(){
'use strict';

angular.module('demoApp.home')
    .controller('lotResultTableController', ['$rootScope', lotResultTableController]);

    function lotResultTableController ($rootScope) {
        var vm = this;

        vm.hideLotResultTable = true;

        vm.close = close;

        initialize();

        function initialize () {
            $rootScope.$on('show-lot-filter-result', function (e, params) {
                if (params.result) vm.lots = angular.copy(params.result);
            });
        }

        function close () {
            vm.hideLotResultTable = true;
        }

    }
}());