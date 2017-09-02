(function(){
'use strict';

angular.module('demoApp.home')
    .controller('searchLotOfferController', ['$rootScope', '$mdDateRangePicker', 'modalServices', 'boundariesService', 'gmapServices', 'SBU_SELECTION', 'lotService', searchLotOfferController]);

    function searchLotOfferController ($rootScope, $mdDateRangePicker, modalServices, boundariesService, gmapServices, SBU_SELECTION, lotService) {
        var vm = this;

        var bounds;

        vm.sbuList = SBU_SELECTION;

        vm.lotFilterForm = {};

        vm.filter = {};

        vm.selectedRange = {
            selectedTemplate: 'TW',
            selectedTemplateName: 'This Week',
            dateStart: null,
            dateEnd: null,
            showTemplate: false,
            fullscreen: false,
            disableTemplates: "NW",
            maxRange: new Date(),
            onePanel: true
        };

        vm.maxDate = new Date();

        vm.regionChanged = regionChanged;
        vm.provinceChanged = provinceChanged;
        vm.cityChanged = cityChanged;
        vm.close = close;
        vm.pickDateRange = pickDateRange;

        vm.search = search;
        vm.clearFilter = clearFilter;

        initialize();

        function initialize () {
            // load regions typeid = 3
            boundariesService.loadBoundariesByType(3)
                .then(function (regions) {
                    vm.regions = angular.copy(regions);
                });
        }

        function close () {
            modalServices.closeModal();
        }

        function regionChanged(regionId) {
            // fit to bounds
            panToBoundary(regionId);

            // load province
            boundariesService.loadBoundaries(regionId)
                .then(function (provinces) {
                    vm.provinces = angular.copy(provinces);
                });
        }

        function provinceChanged(provinceId) {
            // fit to bounds
            panToBoundary(provinceId);

            // load cities
            boundariesService.loadBoundaries(provinceId)
                .then(function (cities) {
                    vm.cities = angular.copy(cities);
                });
        }

        function cityChanged(cityId) {
            // fit to bounds
            panToBoundary(cityId);
        }

        function panToBoundary(boundaryId) {
            boundariesService.getBoundaryDetails(boundaryId)
                .then(function (details) {
                    bounds = gmapServices.fitToBoundsByLatLngArray(details.geometry);
                });
        }

        function formatDateRangeResult (result) {
            var momentDateStart = moment(result.dateStart);
            vm.filter.date_start = momentDateStart.format('YYYY-MM-DD');
            vm.dateRangeFormatted = momentDateStart.format('MMM D, YYYY');

            var momentDateEnd = moment(result.dateEnd);
            vm.filter.date_end = momentDateEnd.format('YYYY-MM-DD');
            vm.dateRangeFormatted += ' - ' + momentDateEnd.format('MMM D, YYYY');
        }

        function pickDateRange($event, showTemplate) {
            vm.selectedRange.showTemplate = showTemplate;
            $mdDateRangePicker.show({
                targetEvent: $event,
                model: vm.selectedRange
            }).then(function (result) {
                if (result) formatDateRangeResult(result);
            })
        }

        function search (filterData) {
            //console.log('search: ',filterData);
            lotService.filterLot(filterData)
                .then(function(lots){
                    $rootScope.$broadcast('show-lot-filter-result', {result: lots});
                });
        }

        function clearFilter () {
            vm.filter = {};
            vm.lotFilterForm.$setPristine(true);
            vm.provinces = [];
            vm.cities = [];
            vm.dateRangeFormatted = '';

            $rootScope.$broadcast('show-lot-filter-result', {result: []});
        }

    }
}());