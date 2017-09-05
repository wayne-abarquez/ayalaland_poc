(function(){
'use strict';

angular.module('demoApp.reports')
    .controller('reportsPageController', ['$rootScope', 'gmapServices', 'lotService', reportsPageController]);

    function reportsPageController ($rootScope, gmapServices, lotService) {
        var vm = this;

        $rootScope.showReportResultsTable = true;
        $rootScope.showReportResultsSelection = false;

        vm.reportsType = [
            {
                label: 'Due Diligence Report - Legal',
                value: 'ISSUES-LEGAL'
            },
            {
                label: 'Due Diligence Report - Technical',
                value: 'ISSUES-TECHNICAL'
            },
            {
                label: 'Landbank Inventory Report via GIS',
                value: 'LOTS'
            },
            {
                label: 'Landbank Inventory Analytics',
                value: 'SBU'
            }
        ];

        initialize();

        vm.showReportsTable = showReportsTable;
        vm.reportTypeChanged = reportTypeChanged;

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

            $rootScope.$watch('currentUser', function (newValue) {
                if (!newValue) return;

                $rootScope.showReportResultsSelection = (['ADMIN', 'CLAU SECRETARY'].indexOf(newValue.role) > -1);
                if ($rootScope.showReportResultsSelection) {
                    $rootScope.showReportResultsTable = false;
                }
            });
        }

        function reportTypeChanged (report) {
            var result = report.split('-');

            var params = {
                type: result[0]
            };

            if (result.length > 1) params.role = result[1];

            $rootScope.showReportResultsTable = true;

            $rootScope.$broadcast('report-type-changed', params);
        }

        function showReportsTable () {
            $rootScope.showReportResultsTable = true;
        }
    }
}());