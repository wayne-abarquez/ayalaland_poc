(function(){
'use strict';

angular.module('demoApp.home')
    .controller('indexController', ['$rootScope', 'gmapServices', 'lotService', 'modalServices', indexController]);

    function indexController ($rootScope, gmapServices, lotService, modalServices) {
        var vm = this;

        vm.createLotOffer = createLotOffer;
        vm.searchLotOffer = searchLotOffer;

        initialize();

        function initialize() {
            gmapServices.createMap('map-canvas');

            $rootScope.$watch('currentUser', function (newValue) {
                if (!newValue) return;
                lotService.loadLots();
            });

            $(document).on('click', '#show-lot-details-btn', function () {
                var lotId = $(this).data('lot-id');
                console.log('show-lot-details-btn clicked', lotId);
                lotService.showLotDetails(lotId);
            });

            $(document).on('click', '#report-lot-issue-btn', function () {
                var lotId = $(this).data('lot-id');
                lotService.showReportIssueModal(lotId);
            });
        }

        function createLotOffer (event) {
            modalServices.showCreateLotOfferForm(event);
        }

        function searchLotOffer (event) {
            modalServices.showSearchLotOfferModal(event);
        }
    }
}());