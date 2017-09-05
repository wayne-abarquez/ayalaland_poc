(function(){
'use strict';

angular.module('demoApp.home')
    .controller('reportIssueModalController', ['user', 'lot', 'modalServices', 'lotService', 'alertServices', reportIssueModalController]);

    function reportIssueModalController (user, lot, modalServices, lotService, alertServices) {
        var vm = this;

        vm.issueStatusSelection = ['OPEN', 'CLOSED'];

        vm.lot = lot;

        vm.form = {};

        vm.issue = {
            userid: user.id,
            lotid: lot.id
        };

        vm.maxDate = new Date();
        vm.selectedDate = null;

        vm.save = save;
        vm.dateChanged = dateChanged;
        vm.close = close;

        initialize();

        function initialize () {
            if (user.role == 'MDC') vm.statusLabel = 'Technical Status';
            else if (user.role == 'LEGAL') vm.statusLabel = 'Legal Status';
        }

        function dateChanged (selectedDate) {
            var momentDate = moment(selectedDate);
            vm.issue.date_reported = momentDate.format('YYYY-MM-DD');
        }

        function save () {
            lotService.reportIssue(vm.lot.id, vm.issue)
                .then(function(){
                    vm.issue = {};
                    alertServices.showSuccess('Issue Reported.');
                }).finally(function(){
                    modalServices.hideResolveModal();
                });
        }

        function close () {
            modalServices.closeModal();
        }
    }
}());