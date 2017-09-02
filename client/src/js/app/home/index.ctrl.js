(function(){
'use strict';

angular.module('demoApp.home')
    .controller('indexController', ['lotService', 'modalServices', indexController]);

    function indexController (lotService, modalServices) {
        var vm = this;

        vm.createLotOffer = createLotOffer;
        vm.searchLotOffer = searchLotOffer;

        initialize();

        function initialize() {
            lotService.loadLots();
        }

        function createLotOffer (event) {
            modalServices.showCreateLotOfferForm(event);
        }

        function searchLotOffer (event) {
            modalServices.showSearchLotOfferModal(event);
        }
    }
}());