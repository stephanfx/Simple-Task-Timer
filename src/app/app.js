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
	.controller('TaskCtrl', ['$scope', 'Tasks', '$interval', '$filter',
		function($scope, Tasks, $interval, $filter) {
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

			$scope.totalTime = function(time){
				var total = time.end - time.start;
				return $filter('toTime')(total);
			};

			$scope.updateTime = function(time, task){
				if (time.start > time.end){
					return false;
				}
				time.total = moment(time.end).diff(moment(time.start));
				task.total = 0;
				for (var x = task.times.length - 1; x >= 0; x--) {
					task.times[x].total = moment(task.times[x].end).diff(moment(task.times[x].start));
					task.total += task.times[x].total;
				}
				Tasks.persist();
			};
		}
	])
	.filter('toTime', function() {
		return function(input) {
			if (typeof input !== "undefined") {
				var m = moment.duration(input),
					day = parseInt(m.get('d')),
					dayHrs = 0,
					hrs = parseInt(m.get('h')),
					min = parseInt(m.get('m')),
					sec = parseInt(m.get('s'));
				if (day > 0) {
					dayHrs = parseInt(day * 24);
					hrs += dayHrs;
				}
				if (min < 10) {
					min = "0" + min;
				}
				if (sec < 10) {
					sec = "0" + sec;
				}
				if (hrs < 10) {
					hrs =  "0" + hrs;
				}

				return hrs + ":" + min + ":" + sec;
			}
		};
	});


