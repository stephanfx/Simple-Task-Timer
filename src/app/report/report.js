/**
* Reporting Module
*
* Reporting module to be used in the app
*/
angular.module('Reporting', ['Tasks']).
controller('ReportingCtrl', ['$scope', 'Tasks', function($scope, Tasks){
	$scope.results = Tasks.getDailyTimes();
}]);