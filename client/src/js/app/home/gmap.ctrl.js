(function(){
'use strict';

angular.module('demoApp.home')
    .controller('gmapController', ['gmapServices', gmapController]);

    function gmapController(gmapServices) {

        var vm = this;

        vm.initialize = initialize;

        vm.initialize();

        function initialize () {
            gmapServices.createMap('map-canvas');
        }
    }
}());