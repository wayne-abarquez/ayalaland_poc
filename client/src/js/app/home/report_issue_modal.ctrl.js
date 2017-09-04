(function(){
'use strict';

angular.module('demoApp.home')
    .controller('reportIssueModalController', ['user', 'lot', 'modalServices', 'lotService', 'alertServices', reportIssueModalController]);

    function reportIssueModalController (user, lot, modalServices, lotService, alertServices) {
        var vm = this;

        vm.issueStatusSelection = ['OPEN'];

        vm.lot = lot;

        vm.form = {};

        vm.issue = {
            userid: user.id,
            lotid: lot.id
        };

        vm.save = save;
        vm.close = close;

        initialize();
        
        function initialize () {
            console.log('lot resolved: ',lot);

            if (user.role == 'MDC') vm.statusLabel = 'Technical Status';
            else if (user.role == 'LEGAL') vm.statusLabel = 'Legal Status';
        }

        function save () {
            console.log('save', vm.issue);
            lotService.reportIssue(lot.id, vm.issue)
                .then(function(issue){
                    alertServices.showSuccess('Issue Reported.');
                    modalServices.hideResolveModal(issue);
                });
        }

        function close () {
            modalServices.closeModal();
        }
    }
}());