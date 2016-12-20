(function () {
    'use strict';

    angular.module('table-app', [])
        .controller('table-ctrl', TableController);

    TableController.$inject = ['$scope', '$http', '$window'];
    function TableController($scope, $http, $window) {
        $scope.title = "Experts Table";
        $scope.load = load;
        $scope.select = select;
        $scope.getField = getField;
        $scope.safeTypeOf = safeTypeOf;
        $scope.fieldNames = [];
        $scope.experts = [];
        $scope.expertCheckBox = [];
        $scope.resultCheckBox = [];
        /**
         * Load JSON of the tables
         */
        function load() {
            loadExperts();
            loadResults();
        }

        function loadExperts() {
            $http.post('/experts')
                .then(function (response) {
                    $scope.fieldNames = response.data.fieldNames.sort();
                    $scope.experts = response.data.experts.sort(function (a, b) {
                        var textA = a.expert_name.toUpperCase();
                        var textB = b.expert_name.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });
                }, function (response) {
                    console.error(response);
                });
        }

        function loadResults() {
            $http.post('/results')
                .then(function (response) {
                    $scope.resultsFieldNames = response.data.resultFieldNames.sort();
                    $scope.results = response.data.results.sort(function (a, b) {
                        var textA = a._expert.toUpperCase();
                        var textB = b._expert.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });
                }, function (response) {
                    console.error(response);
                });
        }

        function safeTypeOf(current) {
            if (Array.isArray(current))
                return 'array';
            return typeof current;
        }

        function getField(ex_name, field) {
            var ex = {};
            for (var i = 0; i < $scope.experts.length; i++) {
                if ($scope.experts[i].expert_name == ex_name) {
                    ex = $scope.experts[i]; break;
                }
            }
            return ex.key_status[field];
        }

        function select($event, item, expertResult) {
            if ($event.altKey && $event.shiftKey) {
                $window.open('view-source:' + expertResult._url, '_blank');
            }
            else if ($event.altKey) {
                $window.open(expertResult._url, '_blank');
            }
            else
                $scope.selected = item;
        }
    }
})();