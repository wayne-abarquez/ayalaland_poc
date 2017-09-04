(function(){
'use strict';

angular.module('demoApp.reports')
    .factory('issuesService', ['Issue', '$q', issuesService]);

    function issuesService (Issue, $q) {
        var service = {};

        service.getIssuesByUserRole = getIssuesByUserRole;

        function getIssuesByUserRole (role) {
            var dfd = $q.defer();

            var type = 'ALL';

            if (role == 'LEGAL') {
                type = 'LEGAL';
            } else if (role == 'MDC') {
                type = 'TECHNICAL';
            }

            Issue.getList({type: type})
                .then(function(response){
                    dfd.resolve(response.plain());
                }, function(error){
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        return service;
    }
}());