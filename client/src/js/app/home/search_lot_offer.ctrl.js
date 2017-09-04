(function(){
'use strict';

angular.module('demoApp.home')
    .controller('searchLotOfferController', ['$rootScope', '$mdDateRangePicker', 'modalServices', 'boundariesService', 'gmapServices', 'SBU_SELECTION', 'lotService', 'alertServices', 'userSessionService', searchLotOfferController]);

    function searchLotOfferController ($rootScope, $mdDateRangePicker, modalServices, boundariesService, gmapServices, SBU_SELECTION, lotService, alertServices, userSessionService) {
        var vm = this;

        var bounds;

        vm.lotStatusList = [];

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
        vm.lotStatusChanged = lotStatusChanged;
        vm.close = close;
        vm.pickDateRange = pickDateRange;

        vm.search = search;
        vm.clearFilter = clearFilter;

        initialize();

        function initialize () {
            // load regions typeid = 3
            boundariesService.loadBoundariesByType(3)
                .then(function (regions) {
                    vm.regions = [''].concat(angular.copy(regions));
                });

            $rootScope.$watch('currentUser', function (user) {
                if (!user) return;

                vm.lotStatusList = [''].concat(lotService.getLotStatusSelectionByRole(user.role));
            });
        }

        function close () {
            modalServices.closeModal();
        }

        function regionChanged(regionId) {
            if (!regionId && vm.filter.hasOwnProperty('region')) delete vm.filter.region;

            // fit to bounds
            panToBoundary(regionId);

            // load province
            boundariesService.loadBoundaries(regionId)
                .then(function (provinces) {
                    vm.provinces = [''].concat(angular.copy(provinces));
                });
        }

        function provinceChanged(provinceId) {
            if (!provinceId && vm.filter.hasOwnProperty('province')) delete vm.filter.province;

            // fit to bounds
            panToBoundary(provinceId);

            // load cities
            boundariesService.loadBoundaries(provinceId)
                .then(function (cities) {
                    vm.cities = [''].concat(angular.copy(cities));
                });
        }

        function cityChanged(cityId) {
            if (!cityId && vm.filter.hasOwnProperty('city')) delete vm.filter.city;

            // fit to bounds
            panToBoundary(cityId);
        }

        function lotStatusChanged(status) {
            if (!status && vm.filter.hasOwnProperty('lot_status')) delete vm.filter.lot_status;
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

        function clearDateRange () {
            vm.dateRangeFormatted = '';
            delete vm.filter.date_start;
            delete vm.filter.date_end;
        }

        function pickDateRange($event, showTemplate) {
            vm.selectedRange.showTemplate = showTemplate;
            $mdDateRangePicker.show({
                targetEvent: $event,
                model: vm.selectedRange
            }).then(function (result) {
                console.log('pick date result: ',result);
                if (result.dateStart && result.dateEnd) formatDateRangeResult(result);
                else clearDateRange();
            })
        }

        function search (filterData) {
            $rootScope.$broadcast('show-lot-filter-result', {result: []});

            lotService.filterLot(filterData)
                .then(function(lots){
                    if (lots.length === 0) alertServices.showInfo('No lot offers found.');
                    else $rootScope.$broadcast('show-lot-filter-result', {result: lots});
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