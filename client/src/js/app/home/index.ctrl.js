(function(){
'use strict';

angular.module('demoApp.home')
    .controller('indexController', ['lotService', 'modalServices', indexController]);

    function indexController (lotService, modalServices) {
        var vm = this;

        vm.createLotOffer = createLotOffer;

        initialize();

        function initialize() {
            lotService.loadLots();
        }

        function createLotOffer (event) {
            modalServices.showCreateLotOfferForm(event);
        }
    }
}());