/*! simpleTask - v0.0.1 - 2015-05-13
 * Copyright (c) 2015 ;
 * Licensed 
 */
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



/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

/**
* Reporting Module
*
* Reporting module to be used in the app
*/
angular.module('Reporting', ['Tasks']).
controller('ReportingCtrl', ['$scope', 'Tasks', function($scope, Tasks){
	$scope.results = Tasks.getDailyTimes();
}]);

angular.module('Tasks', []).
factory('Tasks', function() {
	var service = {
		tasks: [],
		timeLeft: [],
		load: load,
		persist: persist,
		fixTimes: fixTimes,
		createTask: createTask,
		startTask: startTask,
		runningTime: runningTime,
		removeTask: removeTask,
		archiveTask: archiveTask,
		stopTask: stopTask,
		calculateTime: calculateTime,
		getWorkTimes: getWorkTimes,
		getDailyTimes: getDailyTimes
	};

	return service;

	function load() {
		if (localStorage.getItem('tasks')) {
			var storedtasks = JSON.parse(localStorage.getItem('tasks'));
			tasks = service.tasks = storedtasks;
			for (var i = tasks.length - 1; i >= 0; i--) {
				if (typeof tasks[i + 1] !== 'undefined') {
					var day = new Date(tasks[i].start).toString('yyyy-MM-dd'),
						nextDay = new Date(tasks[i + 1].start).toString('yyyy-MM-dd');
					if (day !== nextDay) {
						tasks[i].newDay = true;
					}
				}
				service.fixTimes(tasks[i]);
			}
		}
	}

	function persist() {
		if (Storage) {
			localStorage.setItem('tasks', JSON.stringify(service.tasks));
		}
	}

	function fixTimes(task) {
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
		angular.forEach(task.times, function(time, key){
			time.start = moment(time.start).format("YYYY-MM-DD HH:mm:ss");
			time.end = moment(time.end).format("YYYY-MM-DD HH:mm:ss");
		});
		return task;
	}

	function createTask(task, type) {
		if (typeof type == "undefined") {
			type = 'work';
		}
		service.tasks.unshift({
			"name": task.name,
			"estimate": task.estimate,
			"type": type,
			"times": [],
			"total": 0,
			"running": false
		});
		service.persist();
	}

	function startTask(index) {
		var start = moment().format("YYYY-MM-DD HH:mm:ss");
		service.tasks[index].times.push({
			"start": start,
			"end": null
		});
		service.tasks[index].running = true;
		service.persist();
	}

	function runningTime(index) {
		var task = service.tasks[index],
			latest = task.times.length - 1;
		task.runningTime = (moment().valueOf() - task.times[latest].start) + task.total;
	}

	function removeTask(index) {
		service.tasks.splice(index, 1);
		service.persist();
	}

	function archiveTask(index) {
		service.tasks[index].archived = true;
		service.persist();
	}

	function stopTask(index) {
		var task = service.tasks[index],
			timeToStop = task.times.length - 1;
		task.running = false;
		task.times[timeToStop].end = moment().format("YYYY-MM-DD HH:mm:ss");
		service.calculateTime(index);

		service.persist();
	}

	function calculateTime(index) {
		var task = service.tasks[index];
		task.total = 0;
		for (var x = task.times.length - 1; x >= 0; x--) {
			task.times[x].total = moment(task.times[x].end).diff(moment(task.times[x].start));
			task.total += task.times[x].total;
		}
	}

	function getWorkTimes() {
		var workHrs = {};
		for (var x = service.tasks.length - 1; x >= 0; x--) {
			var task = service.tasks[x];
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
	}

	function getDailyTimes() {
		var report = [];
		//Step through all tasks
		for (var i = service.tasks.length - 1; i >= 0; i--) {
			// Step through all times logged for the task
			var task = service.tasks[i];
			for (var j = task.times.length - 1; j >= 0; j--) {
				var time = task.times[j];
				// determine date and see if it is in the report array
				var startTime = moment(time.start),
					endTime = moment(time.end),
					startTimeStr = startTime.format('YYYY-MM-DD'),
					dayExists = false;
				// add date to report if it is not there yet.
				/*jshint loopfunc: true */
				angular.forEach(report, function(day, key){

					if(day.Date == startTimeStr){
						var entryExists = false;
						/*jshint loopfunc: true */
						angular.forEach(day.Entries, function(entry, key){
							if (entry.taskName == task.name){
								entry.total += time.total;
								entryExists = true;
							}
						});
						if (!entryExists) {
							day.Entries.push({"taskName":task.name, total: time.total});
						}

						day.TotalTime += time.total;
						dayExists = true;
					}
				});
				if (!dayExists){
					report.push({"Date":startTimeStr, "TotalTime": time.total, Entries: [{"taskName":task.name, total: time.total}]});
				}
			}
		}
		return report;
	}
});