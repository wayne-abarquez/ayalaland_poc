(function () {
    'use strict';

    angular.module('demoApp')
        .controller('mainController', ['$rootScope', 'APP_NAME', '$mdSidenav', 'userSessionService', mainController]);

    function mainController($rootScope, APP_NAME, $mdSidenav, userSessionService) {
        var vm = this;

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
    }
}());
