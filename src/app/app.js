angular.module('simpleTask', ['ngRoute', 'Reporting', 'templates-main'])
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

angular.module('Tasks', []).
factory('Tasks', function() {
	return {
		tasks: [],
		timeLeft: [],
		load: function() {
			if (localStorage.getItem('tasks')) {
				var storedtasks = JSON.parse(localStorage.getItem('tasks'));
				tasks = this.tasks = storedtasks;
				for (var i = tasks.length - 1; i >= 0; i--) {

					if (typeof tasks[i + 1] !== 'undefined') {
						var day = new Date(tasks[i].start).toString('yyyy-MM-dd'),
							nextDay = new Date(tasks[i + 1].start).toString('yyyy-MM-dd');
						if (day !== nextDay) {
							tasks[i].newDay = true;
						}
					}
				}
			}
		},
		persist: function() {
			if (Storage) {
				localStorage.setItem('tasks', JSON.stringify(this.tasks));
			}
		},
		fixTimes: function(task) {
			if (typeof task.times == "undefined") {
				task.times = [];
				var time = {
					start: task.start,
					end: task.end
				};
				task.times.push(time);
				delete task.start;
				delete task.end;
			}
			if (typeof task.type == "undefined") {
				task.type = "work";
			}
			return task;
		},
		createTask: function(task, type) {
			if (typeof type == "undefined") {
				type = 'work';
			}
			this.tasks.unshift({
				"name": task.name,
				"estimate": task.estimate,
				"type": type,
				"times": [],
				"total": 0,
				"running": false
			});
			this.persist();
		},
		startTask: function(index) {
			var start = moment().valueOf();
			this.tasks[index].times.push({
				"start": start,
				"end": null
			});
			this.tasks[index].running = true;
			this.persist();
		},
		runningTime: function(index) {
			var task = this.tasks[index],
				latest = task.times.length - 1;
			task.runningTime = (moment().valueOf() - task.times[latest].start) + task.total;
		},
		removeTask: function(index) {
			this.tasks.splice(index, 1);
			this.persist();
		},

		archiveTask: function(index) {
			this.tasks[index].archived = true;
			this.persist();
		},
		stopTask: function(index) {
			var task = this.tasks[index],
				timeToStop = task.times.length - 1;
			task.running = false;
			task.times[timeToStop].end = moment().valueOf();
			this.calculateTime(index);

			this.persist();
		},

		calculateTime: function(index) {
			var task = this.tasks[index];
			task.total = 0;
			for (var x = task.times.length - 1; x >= 0; x--) {
				task.times[x].total = task.times[x].end - task.times[x].start;
				task.total += task.times[x].total;
			}
		},
		getWorkTimes: function() {
			var workHrs = {};
			for (var x = this.tasks.length - 1; x >= 0; x--) {
				var task = this.tasks[x];
				// get days worked on
				if (typeof task.times == "undefined") {
					continue;
				} else {
					for (var i = task.times.length - 1; i >= 0; i--) {
						var sdate = moment(task.times[i].start),
							edate = moment(task.times[i].end),
							dayFormat = sdate.format('YYYY-MM-DD');
						if (typeof workHrs[dayFormat] == "undefined") {
							workHrs[dayFormat] = {
								"work": 0,
								"breaktime": 0
							};
						}
						if (task.times[i].end !== null && task.type == "work") {
							var total = edate.valueOf() - sdate.valueOf();
							workHrs[dayFormat].work += total;
						}
						if (task.times[i].end !== null && task.type == "break") {
							var breaktotal = edate.valueOf() - sdate.valueOf();
							workHrs[dayFormat].breaktime += breaktotal;
						}
					}
				}

			}
			return workHrs;
		},
		getDailyTimes: function() {
			var report = {};
			//Step through all tasks
			for (var i = this.tasks.length - 1; i >= 0; i--) {
				// Step through all times logged for the task
				var task = this.tasks[i];
				for (var j = task.times.length - 1; j >= 0; j--) {
					var time = task.times[j];
					// determine date and see if it is in the report array
					var startTime = moment(time.start),
						endTime = moment(time.end),
						startTimeStr = startTime.format('YYYY-MM-DD');
					// add date to report if it is not there yet.
					if (!report.hasOwnProperty(startTimeStr)) {
						report[startTimeStr] = {};
					}
					// add task if not there yet. with a total of 0
					if (!report[startTimeStr][task.name]) {
						report[startTimeStr][task.name] = {
							total: 0
						};
					}

					timespent = time.end - time.start;
					report[startTimeStr][task.name].total = report[startTimeStr][task.name].total + timespent;
				}
			}
			return report;
		}

	};
});