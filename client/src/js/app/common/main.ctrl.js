(function () {
    'use strict';

    angular.module('demoApp')
        .controller('mainController', ['$rootScope', '$scope', 'APP_NAME', '$mdSidenav', 'userSessionService', 'drawingServices', 'gmapServices', mainController]);

    function mainController($rootScope, $scope, APP_NAME, $mdSidenav, userSessionService, drawingServices, gmapServices) {
        var vm = this;

        var autocomplete,
            place;

        // drawing tools
        vm.drawBtn = {
            save: false,
            delete: false,
            cancel: false
        };

        $rootScope.appName = APP_NAME;

        /* Side Nav Menus */
        vm.menu = [];

        var MENU_SELECTIONS = [
            //{
            //    link: '/',
            //    title: 'Channel Diversification',
            //    icon: 'track_changes',
            //    can: ['ADMIN', 'SALES']
            //},
            //{
            //    link: '/frauddetect',
            //    title: 'Fraud Detection',
            //    icon: 'fingerprint',
            //    can: ['ADMIN']
            //},
            //{
            //    link: '/productsaturation',
            //    title: 'Product Saturation',
            //    icon: 'assessment',
            //    can: ['ADMIN']
            //},
            {
                link: '/logout',
                title: 'Logout',
                icon: 'exit_to_app',
                can: ['ADMIN', 'SALES']
            }
        ];

        vm.toggleMainMenu = buildToggler('mainMenuSidenav');
        vm.onMenuItemClick = onMenuItemClick;

        vm.stopDrawing = stopDrawing;
        vm.saveArea = saveArea;
        vm.deleteSelected = deleteSelected;

        initialize();

        function initialize() {
            // loads user details
            $rootScope.$watch('currentUser', function (newValue) {
                if (!newValue) return;
                vm.menu = getUserMenu(newValue);
            });

            $rootScope.$on('modal-opened', function () {
                $rootScope.hasOpenedModal = true;
            });

            $rootScope.$on('modal-closed', function () {
                $rootScope.hasOpenedModal = false;
            });

            $rootScope.$on('start-drawing', function (e, params) {
                var strokeColor = params && params.strokeColor ? params.strokeColor : '#1abc9c';
                startDrawing(strokeColor);
            });

            $rootScope.$on('edit-drawing-polygon', function (e, params) {
                // Show Cancel Map button
                vm.drawBtn.cancel = true;
                vm.drawBtn.save = true;
            });

            $rootScope.$on('end-drawing', function () {
                stopDrawing();
            });

            $rootScope.$on('overlay-complete', function () {
                $scope.$apply(function () {
                    vm.drawBtn.save = true;
                    vm.drawBtn.delete = true;
                });
            });

            /* Address Search */
            autocomplete = gmapServices.initializeAutocomplete('address-search-input');

            autocomplete.addListener('place_changed', function(){
                place = autocomplete.getPlace();

                if (!place.geometry) {
                    alert("Autocomplete's returned place contains no geometry");
                    return;
                }

                if (place.geometry.viewport) {
                    gmapServices.map.fitBounds(place.geometry.viewport);
                } else {
                    gmapServices.setZoomIfGreater(17);
                    gmapServices.map.panTo(place.geometry.location);
                }
            });
        }

        function getUserMenu(user) {
            // TODO: this must come from backend
            var result = [];

            MENU_SELECTIONS.forEach(function (item) {
                if (item.can.indexOf(user.role.toUpperCase()) > -1) return result.push(item);
            });

            return result;
        }

        function buildToggler(navID) {
            return function () {
                $mdSidenav(navID)
                    .toggle();
            }
        }

        function onMenuItemClick(item) {
            if (item.title.toLowerCase() == 'logout') {
                // clean local storage
                userSessionService.userLogout();
            }
        }

        /* Drawing Functions */

        function startDrawing(strokeColor) {
            drawingServices.startDrawingMode(strokeColor);
            // Show Cancel Map button
            vm.drawBtn.cancel = true;
        }


        /* Drawing Functions */
        function saveArea() {
            if (drawingServices.drawPolygon) {
                $rootScope.$broadcast('save-drawing');
                for (var key in vm.drawBtn) vm.drawBtn[key] = false;
                return;
            }

            if (!drawingServices.overlay) {
                console.log('Cannot proceed. No Overlay Drawn.')
                return;
            }

            var area = drawingServices.overlayDataArray;
            $rootScope.$broadcast('save-area', {area: area});
            vm.stopDrawing();
        }

        function deleteSelected() {
            if (drawingServices.overlay) {
                drawingServices.clearOverlay();
                vm.drawBtn.save = false;
                vm.drawBtn.delete = false;
            }

            $rootScope.$broadcast('delete-selected');
        }

        function stopDrawing() {
            if (drawingServices.drawPolygon) gmapServices.setPolygonEditable(drawingServices.drawPolygon, false);

            $rootScope.$emit('terminate-drawing');

            drawingServices.stopDrawingMode();

            //projectAreaDrawingServices.stopDrawing();

            // hide draw buttons
            for (var key in vm.drawBtn) vm.drawBtn[key] = false;
        }


    }
}());
