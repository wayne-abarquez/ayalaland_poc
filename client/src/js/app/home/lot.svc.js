(function(){
'use strict';

angular.module('demoApp.home')
    .factory('lotService', ['$rootScope', 'Lot', 'LOT_STATUS_SELECTION', 'LEGAL_STATUS_SELECTION', 'TECHNICAL_STATUS_SELECTION', 'gmapServices', '$q', 'modalServices', lotService]);

    function lotService ($rootScope, Lot, LOT_STATUS_SELECTION, LEGAL_STATUS_SELECTION, TECHNICAL_STATUS_SELECTION, gmapServices, $q, modalServices) {
        var service = {};

        var infowindow = gmapServices.createInfoWindow('');

        var lots = [];

        service.getLotStatusSelectionByRole = getLotStatusSelectionByRole;
        service.loadLots = loadLots;
        service.addLot = addLot;
        service.saveLot = saveLot;
        service.filterLot = filterLot;
        service.showLot = showLot;
        service.showLotDetails = showLotDetails;
        service.showReportIssueModal = showReportIssueModal;
        service.reportIssue = reportIssue;
        service.getLandBankDataBySBU = getLandBankDataBySBU;
        service.getLandBankDataViaGIS = getLandBankDataViaGIS;
        service.getLegalStatusSelectionByRole = getLegalStatusSelectionByRole;
        service.getTechnicalStatusSelectionByRole = getTechnicalStatusSelectionByRole;

        function getLotStatusSelectionByRole (role, lotStatus) {
            var lotStatuses = LOT_STATUS_SELECTION;
            var finalStatus = [];

            switch(role) {
                case 'ADMIN':
                    finalStatus = lotStatuses;
                    break;
                case 'CLAU SECRETARY':
                    finalStatus = lotStatuses;
                    break;
                case 'LEGAL':
                    finalStatus = lotStatuses.filter(function(status){
                        return ['DUE DILIGENCE COMPLETED', 'FOR IC APPROVAL', 'ACQUIRE'].indexOf(status) === -1;
                    });
                    break;
                case 'MDC':
                    finalStatus = lotStatuses.filter(function (status) {
                        return ['DUE DILIGENCE COMPLETED', 'FOR IC APPROVAL', 'ACQUIRE'].indexOf(status) === -1;
                    });
                    break;
                case 'SBU BUSINESS DEV':
                    var lotStatusFiltered = lotStatuses.filter(function (status) {
                        return ['DUE DILIGENCE IN PROGRESS', 'DUE DILIGENCE COMPLETED'].indexOf(status) === -1;
                    });

                    if (lotStatus && lotStatus == 'ACTIVE') {
                        finalStatus = ['ACTIVE', 'FOR DUE DILIGENCE'];
                    } else if (lotStatus && lotStatus == 'FOR DUE DILIGENCE') {
                        finalStatus = ['FOR DUE DILIGENCE'];
                    } else if (lotStatus && lotStatus == 'DUE DILIGENCE COMPLETED') {
                        finalStatus = ['FOR IC APPROVAL', 'ACQUIRE'];
                    } else {
                        finalStatus = lotStatusFiltered;
                    }
                    break;
                //case 'CLAU ANALYST':
                //    return lotStatuses;
                //    break;
                //case 'C&A':
                //    return lotStatuses;
                //    break;
                default:
                    if (lotStatus) finalStatus = [lotStatus];
                    else finalStatus = lotStatuses;
            }

            if (lotStatus && finalStatus.indexOf(lotStatus) === -1) finalStatus.push(lotStatus);

            return finalStatus;
        }

        function getLegalStatusSelectionByRole (role, currentlegalStatus, currentLotStatus) {
            var legalStatuses = LEGAL_STATUS_SELECTION;
            var finalStatus = [];

            switch (role) {
                case 'ADMIN':
                    finalStatus = legalStatuses;
                    break;
                case 'LEGAL':
                    if (currentLotStatus === 'FOR DUE DILIGENCE') {
                        finalStatus = ['OK', 'LDD IN PROGRESS'];
                    } else if (currentLotStatus === 'DUE DILIGENCE IN PROGRESS') {
                        finalStatus = ['LDD IN PROGRESS', 'LDD COMPLETED'];
                    } else {
                        finalStatus = ['OK'];
                    }
                    break;
                default:
                    finalStatus = [currentlegalStatus];
            }

            if (finalStatus.indexOf(currentlegalStatus) === -1) finalStatus.push(currentlegalStatus);

            return finalStatus;
        }

        function getTechnicalStatusSelectionByRole(role, currentTechnicalStatus, currentLotStatus) {
            var technicalStatuses = TECHNICAL_STATUS_SELECTION;
            var finalStatus = [];

            switch (role) {
                case 'ADMIN':
                    finalStatus = technicalStatuses;
                    break;
                case 'MDC':
                    if (currentLotStatus === 'FOR DUE DILIGENCE') {
                        finalStatus = ['OK', 'TDD IN PROGRESS'];
                    } else if (currentLotStatus === 'DUE DILIGENCE IN PROGRESS') {
                        if (currentTechnicalStatus == 'OK') {
                            finalStatus = ['OK', 'TDD IN PROGRESS'];
                        } else {
                            finalStatus = ['TDD IN PROGRESS', 'TDD COMPLETED'];
                        }
                    } else {
                        finalStatus = ['OK'];
                    }
                    break;
                default:
                    finalStatus = [currentTechnicalStatus];
            }

            if (finalStatus.indexOf(currentTechnicalStatus) === -1) finalStatus.push(currentTechnicalStatus);

            return finalStatus;
        }

        function loadLots () {
            Lot.getList()
                .then(function(response){
                    response.plain().forEach(function(item){
                        addLot(item);
                    });
                });
        }

        function createLotPolygon (latlngArray, isReadOnly, latlngCenter, labelText) {
            var polygon = gmapServices.createPolygon(latlngArray, '#2ecc71', true);

            if (isReadOnly) {
                polygon.inviMarker = gmapServices.initMarker(latlngCenter, null, {visible: false});
                polygon.label = new Label({map: gmapServices.map, text: labelText});
                polygon.label.bindTo('position', polygon.inviMarker, 'position');
            }

            return polygon;
        }

        function addLot (item, isReadOnly) {
            var polygon;

            if (isReadOnly) {
                polygon = createLotPolygon(item.geom, isReadOnly, item.center, item.project_name);
            } else {
                polygon = createLotPolygon(item.geom);
            }

            polygon = angular.merge(polygon, item);

            if (!isReadOnly) {
                polygon.center = gmapServices.getPolygonCenter(polygon);

                polygon.content = '<div>';
                polygon.content += '<h4 class="no-margin text-muted padding-left-5">Project Name: ' + (item.project_name ? item.project_name : '') + '</h4>';
                polygon.content += '<h4 class="no-margin padding-left-5">Estate Name: <b>' + (item.estate_name ? item.estate_name : '') + '</b></h4>';
                polygon.content += '<h4 class="no-margin text-muted padding-left-5">SBU: ' + (item.sbu ? item.sbu : '') + '</h4>';
                polygon.content += '<h4 class="no-margin text-muted padding-left-5">Lot Status: ' + (item.lot_status ? item.lot_status : '') + '</h4>';

                /* Action Buttons */
                polygon.content += '<button id="show-lot-details-btn" data-lot-id="' + item.id + '" class="md-button md-raised">Show Details</button>';

                //if (['MDC', 'LEGAL'].indexOf($rootScope.currentUser.role) > -1 && item.lot_status == 'DUE DILIGENCE IN PROGRESS') {
                if (['MDC', 'LEGAL'].indexOf($rootScope.currentUser.role) > -1) {
                    polygon.content += '<button id="report-lot-issue-btn" data-lot-id="' + item.id + '" class="md-button md-raised md-warn">Report Issue</button>';
                }

                polygon.content += '</div>';

                gmapServices.addListener(polygon, 'click', function(e){
                    console.log('lot click: ',e);
                    infowindow.open(gmapServices.map);
                    infowindow.setPosition(e.latLng);
                    //infowindow.setPosition(this.center);
                    infowindow.setContent(this.content);
                });

            }

            lots.push(polygon);

            //gmapServices.fitToBoundsByPolygon(polygon);
        }

        // if lotId is not null perform update otherwise perform create
        function saveLot (lotData, lotId) {
            var dfd = $q.defer();

            if (lotId) { // update
                Lot.cast(lotId)
                    .customPUT(lotData)
                    .then(function (response) {
                        var resp = response.plain();

                        var index = _.findIndex(lots, {id: resp.lot.id});

                        if (index > -1) {
                            lots[index].lot_status = resp.lot.lot_status;
                            lots[index].legal_status = resp.lot.legal_status;
                            lots[index].technical_status = resp.lot.technical_status;
                        }

                        dfd.resolve(resp.lot);
                    }, function (error) {
                        dfd.reject(error);
                    });
            } else { // insert
                Lot.post(lotData)
                    .then(function (response) {
                        var resp = response.plain();
                        addLot(resp.lot);
                        dfd.resolve(resp.lot);
                    }, function (error) {
                        dfd.reject(error);
                    });
            }

            return dfd.promise;
        }

        function clearLots () {
            lots.forEach(function(lot){
                lot.setMap(null);
            });
            lots = [];
        }

        function filterLot (filterData) {
            var dfd = $q.defer();

            clearLots();

            Lot.getList(filterData)
                .then(function(response){
                    var resp = response.plain();

                    resp.forEach(function(item){
                       addLot(item);
                    });

                    dfd.resolve(resp);
                }, function (error){
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        function showLot (lotId) {
            var lot = _.findWhere(lots, {id: lotId});

            if (lot) {
                gmapServices.fitToBoundsByPolygon(lot);
                gmapServices.trigger(lot, 'click', {latLng: lot.center});
            }
        }


        function showLotDetails (lotId) {
            Lot.get(lotId)
                .then(function(response){
                    var resp = response.plain();
                    console.log('get lot details id = '+lotId, resp);

                    infowindow.close();

                    lots.forEach(function (item) {
                        if (item.id != lotId) item.setMap(null);
                        else gmapServices.fitToBoundsByPolygon(item);
                    });

                    modalServices.showLotDetailsModal(resp)
                        .finally(function(){
                            lots.forEach(function (item) {
                                if (item.id != lotId) {
                                    item.setMap(gmapServices.map);
                                }
                            })
                        });
                });
        }

        function showReportIssueModal (lotId) {
            modalServices.showReportIssueModal($rootScope.currentUser, lotId)
                .finally(function(){
                    $rootScope.hasOpenedModal = false;
                });
        }

        function reportIssue (lotId, issueData) {
            var dfd = $q.defer();

            Lot.cast(lotId).customPOST(issueData, 'issues')
                .then(function(response){
                    dfd.resolve(response.plain());
                }, function(error){
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        function getLandBankDataBySBU (sbu) {
            var dfd = $q.defer();

            Lot.customGET('landbank-inventory', {sbu: sbu})
                .then(function (response) {
                    dfd.resolve(response.plain());
                }, function (error) {
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        function getLandBankDataViaGIS () {
            var dfd = $q.defer();

            Lot.customGET('landbank-inventory-gis')
                .then(function (response) {
                    dfd.resolve(response.plain());
                }, function (error) {
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        return service;
    }
}());