(function () {
    'use strict';

    angular.module('demoApp')
        .factory('modalServices', ['$q', '$mdDialog', '$mdMedia', '$rootScope', 'Lot', modalServices]);

    function modalServices($q, $mdDialog, $mdMedia, $rootScope, Lot) {
        var service = {};

        var customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var createLotOfferModal,
            searchLotOfferModal,
            lotDetailsModal,
            reportIssueModal
        ;

        /* Service Functions */
        service.showCreateLotOfferForm = showCreateLotOfferForm;
        service.showSearchLotOfferModal = showSearchLotOfferModal;
        service.hideResolveModal = hideResolveModal;
        service.showLotDetailsModal = showLotDetailsModal;
        service.showReportIssueModal = showReportIssueModal;
        service.closeModal = closeModal;

        function showModal(modalObj, modalParams) {
            var dfd = $q.defer();
            if (modalObj) {
                dfd.reject("Modal already opened");
            } else {
                $rootScope.$broadcast("modal-opened");
                modalObj = $mdDialog.show(modalParams);
                modalObj.then(function (result) {
                        dfd.resolve(result);
                    }, function (reason) {
                        $rootScope.$broadcast("modal-dismissed");
                        dfd.reject(reason);
                    })
                    .finally(function () {
                        modalObj = null;
                    });
            }
            return dfd.promise;
        }

        function showCreateLotOfferForm(ev) {
            var opts = {
                controller: 'createLotOfferFormController',
                controllerAs: 'vm',
                templateUrl: '/partials/modals/create_lot_offer_form.html',
                parent: angular.element(document.querySelector('#index-container')),
                targetEvent: ev,
                hasBackdrop: false,
                fullscreen: customFullscreen,
                onComplete: function (scope, element, options) {
                    $('.md-scroll-mask').css('z-index', '-1');
                }
            };

            return showModal(createLotOfferModal, opts);
        }

        function showSearchLotOfferModal(ev) {
            var opts = {
                controller: 'searchLotOfferController',
                controllerAs: 'vm',
                templateUrl: '/partials/modals/search_lot_offer.html',
                parent: angular.element(document.querySelector('#index-container')),
                targetEvent: ev,
                hasBackdrop: false,
                fullscreen: customFullscreen,
                onComplete: function (scope, element, options) {
                    $('.md-scroll-mask').css('z-index', '-1');
                }
            };

            return showModal(searchLotOfferModal, opts);
        }

        function showLotDetailsModal (lotData) {
            var opts = {
                controller: 'lotDetailsModalController',
                controllerAs: 'vm',
                templateUrl: '/partials/modals/lot_details.html',
                parent: angular.element(document.querySelector('#index-container')),
                locals: {lot: lotData},
                hasBackdrop: false,
                fullscreen: customFullscreen,
                onComplete: function (scope, element, options) {
                    $('.md-scroll-mask').css('z-index', '-1');
                }
            };

            return showModal(lotDetailsModal, opts);
        }

        function showReportIssueModal (userParam, lotId) {
            var opts = {
                controller: 'reportIssueModalController',
                controllerAs: 'vm',
                templateUrl: '/partials/modals/report_issue_form.html',
                parent: angular.element(document.querySelector('#index-container')),
                locals: {user: userParam, lotId: lotId},
                resolve: {
                    lot: function (){
                        return Lot.get(lotId);
                    }
                },
                hasBackdrop: false,
                fullscreen: customFullscreen,
                onComplete: function (scope, element, options) {
                    $('.md-scroll-mask').css('z-index', '-1');
                }
            };

            return showModal(reportIssueModal, opts);
        }

        function hideResolveModal(response) {
            $rootScope.$broadcast("modal-closed");
            $mdDialog.hide(response);
        }

        // Close Modal
        function closeModal() {
            $rootScope.$broadcast("modal-closed");
            $mdDialog.cancel();
        }

        return service;
    }
}());