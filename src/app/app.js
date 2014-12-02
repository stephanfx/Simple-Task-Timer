angular.module('simpleTask', ['ngRoute', 'ngAnimate', 'Reporting', 'templates-main'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider
				.when('/', {
					controller: 'TaskCtrl',
					templateUrl: 'app/tasks.tpl.html'
				})
				.when('/report', {
					controller: 'ReportingCtrl',
					templateUrl: 'app/report/report.tpl.html'
				})
				.otherwise('/');
		}
	])
	.controller('HeaderCtrl', ['$scope', 'Tasks', '$interval',
		function($scope, Tasks, $interval) {
			$scope.task = {};
			$scope.createTask = function(task) {
				Tasks.createTask(task);
				$scope.task = null;
			};
			$scope.removeTask = function(index) {
				Tasks.removeTask(index);
			};
			$scope.startBreak = function() {
				Tasks.createTask({
					name: "Break",
					estimate: 0
				}, 'break');
				Tasks.startTask(0);
				Tasks.archiveTask(0);
				$scope.breakTime = true;
				$scope.getWorkTimes();
			};
			$scope.stopBreak = function() {
				Tasks.stopTask(0);
				$scope.breakTime = false;
				$scope.getWorkTimes();
			};
			$scope.getWorkTimes = function() {
				var times = Tasks.getWorkTimes();
				$scope.worktimes = times[moment().format('YYYY-MM-DD')];
			};
		}
	])
	//comment for testing Atom.io
	//
	.controller('TaskCtrl', ['$scope', 'Tasks', '$interval',
		function($scope, Tasks, $interval) {
			Tasks.load();
			$scope.tasks = Tasks.tasks;
			$scope.startTask = function(index) {
				Tasks.startTask(index);
				$scope.interval = $interval(function() {
					Tasks.runningTime(index);
				}, 1000);

			};
			$scope.stopTask = function(index) {
				Tasks.stopTask(index);
				$interval.cancel($scope.interval);

			};
			$scope.archiveTask = function(index) {
				Tasks.archiveTask(index);
			};
		}
	])
	.filter('toTime', function() {
		return function(input) {
			if (typeof input !== "undefined") {
				var m = moment.duration(input),
					min = m.get('m'),
					sec = m.get('s');
				if (min < 10) {
					min = "0" + min;
				}
				if (sec < 10) {
					sec = "0" + sec;
				}
				return m.get('h') + ":" + min + ":" + sec;
			}
		};
	});


