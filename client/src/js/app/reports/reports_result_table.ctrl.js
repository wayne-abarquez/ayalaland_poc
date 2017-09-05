(function(){
'use strict';

angular.module('demoApp.home')
    .controller('reportsResultTableController', ['$rootScope', 'issuesService', 'lotService', '$filter', 'SBU_SELECTION', reportsResultTableController]);

    function reportsResultTableController ($rootScope, issuesService, lotService, $filter, SBU_SELECTION) {
        var vm = this;

        vm.filter = {};

        vm.report = {
            title: '',
            headers: [],
            result: [],
            dataType: ''
        };

        vm.rowOnClick = rowOnClick;
        vm.sbuChanged = sbuChanged;
        vm.close = close;

        initialize();

        function initialize () {
            $rootScope.$watch('currentUser', function (newValue) {
                if (!newValue) return;

                if (['LEGAL', 'MDC'].indexOf(newValue.role) > -1) {
                    issuesService.getIssuesByUserRole(newValue.role)
                        .then(function(issues){
                            vm.report.title = 'LEGAL' == newValue ? 'Legal Issues' : 'Technical Issues';
                            vm.report.headers = ['lot_offer_no', 'project_name', 'date_reported', 'description', 'action_item', 'status'];
                            vm.report.dataType = 'ISSUES';

                            if (issues.length > 0) {
                                lotService.loadLots();
                                vm.report.result = angular.copy(issues).map(function (item) {
                                    return Object.flatten(item);
                                });
                                return;
                            }
                        });
                } else if (newValue.role == 'C&A') {
                    vm.report.title = 'Landbank Inventory Analytics';
                    vm.report.headers = ['total_land_value', 'total_value_of_ali_owned', 'gfa'];
                    vm.report.dataType = 'SBU';

                    vm.filter.sbuSelection = ['ALL'].concat(SBU_SELECTION);

                    lotService.loadLots();

                    sbuChanged('ALL');

                } else if (newValue.role == 'CLAU ANALYST') {
                    vm.report.title = 'Landbank Inventory Report via GIS';
                    vm.report.headers = ['lot_offer_no', 'estate_name', 'project_name', 'complete_address', 'sbu', 'lot_status'];
                    vm.report.dataType = 'LOTS';

                    lotService.getLandBankDataViaGIS()
                        .then(function(result){
                            vm.report.result = angular.copy(result);
                            vm.report.result.forEach(function(item){
                               lotService.addLot(item, true);
                            });
                        });
                }
            });
        }

        function sbuChanged (sbu) {
            vm.filter.sbuType = sbu;

            lotService.getLandBankDataBySBU(vm.filter.sbuType)
                .then(function (result) {
                    //vm.report.result = result.map(function (item) {
                    //    for (var key in item) {
                    //        if (!isNaN(item[key])) {
                    //            item[key] = $filter('number')(item[key], 2);
                    //        }
                    //    }
                    //    return item;
                    //});

                    vm.report.result = [{
                        'total_land_value': $filter('number')(_.pluck(result, 'total_land_value').reduce(function (sum, value) {
                            return sum + value;
                        }, 0),2),

                        'total_value_of_ali_owned': $filter('number')(_.pluck(result, 'total_value_of_ali_owned').reduce(function (sum, value) {
                            return sum + value;
                        }, 0), 2),

                        'gfa': $filter('number')(_.pluck(result, 'gfa').reduce(function (sum, value) {
                            return sum + value;
                        }, 0), 2)
                    }];
                });
        }

        function rowOnClick (item) {
            console.log('rowOnClick: ',item);
            if (vm.report.dataType == 'ISSUES') {
                lotService.showLot(item.lotid);
            } else if(vm.report.dataType == 'LOTS') {
                lotService.showLot(item.id);
            } else if (vm.report.dataType == 'SBU') {
                lotService.showLot(Math.abs(item.lotid));
            }

        }

        function close () {
            $rootScope.showReportResultsTable = false;
        }

    }
}());