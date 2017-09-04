(function () {
    'use strict';

    angular
        .module('demoApp.authentication', [
            'ngSanitize',
            'ngMaterial',
            'ngAnimate',
            'oitozero.ngSweetAlert'
        ])

        .constant('BASE_URL', window.location.origin)

        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('red')
                .accentPalette('pink');
        })
    ;

    angular.module('demoApp.authentication')
        .controller('loginPageController', [loginPageController])

    function loginPageController () {
        var vm = this;

        vm.selectedUser = '';
        vm.pw = 'ayalaland';

        vm.users = [
            {
                username: 'admin',
                role: 'ADMIN'
            },
            {
                username: 'user1',
                role: 'CLAU SECRETARY'
            },
            {
                username: 'user2',
                role: 'LEGAL'
            },
            {
                username: 'user3',
                role: 'MDC'
            },
            {
                username: 'user4',
                role: 'SBU BUSINESS DEV'
            },
            {
                username: 'user5',
                role: 'CLAU ANALYST'
            },
            {
                username: 'user6',
                role: 'C&A'
            }
        ];

        vm.proceed = proceed;
        vm.userChanged = userChanged;

        function userChanged (user) {
            vm.selectedUser = user;
        }

        function proceed () {
            $('.loginForm input#username').val(vm.selectedUser);
            $('.loginForm input#password').val(vm.pw);
            $('.loginForm .signin-button').trigger('click');
        }
    }

}());