(function(){
'use strict';

angular.module('demoApp.reports')
    .controller('reportsPageController', ['$rootScope', 'gmapServices', 'lotService', reportsPageController]);

    function reportsPageController ($rootScope, gmapServices, lotService) {
        var vm = this;

        $rootScope.showReportResultsTable = true;

        initialize();

        vm.showReportsTable = showReportsTable;

        function initialize() {
            gmapServices.createMap('map-canvas');

            $(document).on('click', '#show-lot-details-btn', function (){
               var lotId = $(this).data('lot-id');
               lotService.showLotDetails(lotId);
            });

            $(document).on('click', '#report-lot-issue-btn', function (){
                var lotId = $(this).data('lot-id');
                lotService.showReportIssueModal(lotId);
            });
        }

        function showReportsTable () {
            $rootScope.showReportResultsTable = true;
        }
    }
}());