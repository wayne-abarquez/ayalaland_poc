(function(){
'use strict';

angular.module('demoApp.home')
    .controller('lotResultTableController', ['$rootScope', 'lotService', lotResultTableController]);

    function lotResultTableController ($rootScope, lotService) {
        var vm = this;

        var lotsTemp = [];

        vm.rowOnClick = rowOnClick;
        vm.showLotDetails = showLotDetails;
        vm.reportLotIssue = reportLotIssue;
        vm.close = close;

        initialize();

        function initialize () {
            $rootScope.$on('show-lot-filter-result', function (e, params) {
                if (params.result) vm.lots = angular.copy(params.result);
            });
        }

        function rowOnClick (lotId) {
            lotService.showLot(lotId);
        }

        function showLotDetails (lotId) {
            lotService.showLotDetails(lotId);
        }

        function reportLotIssue (lotId) {
            lotService.showReportIssueModal(lotId);
        }

        function close () {
            lotsTemp = angular.copy(vm.lots);
            vm.lots = [];
        }

    }
}());