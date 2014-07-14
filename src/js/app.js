angular.module('simpleTask', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {

		}
	])
	.controller('TaskCtrl', ['$scope', 'Tasks', '$interval',
		function($scope, Tasks, $interval) {
			Tasks.load();

			$scope.tasks = Tasks.tasks;
			$scope.createTask = function(task) {
				Tasks.createTask(task);
				$scope.task = null;
			};
			$scope.startTask = function(index) {
				Tasks.startTask(index);
				$scope.interval = $interval(function() {
					Tasks.runningTime(index);
				}, 1000);
			};
			$scope.stopTask = function(index){
				Tasks.stopTask(index);
				$interval.cancel($scope.interval);
			};
			$scope.removeTask = function(index){
				Tasks.removeTask(index);
			};
			$scope.archiveTask = function(index) {
				Tasks.archiveTask(index);
			};
			$scope.startBreak = function(){
				Tasks.createTask({name: "Break", estimate: 0}, 'break');
				Tasks.startTask(0);
				Tasks.archiveTask(0);
				$scope.breakTime = true;
			};
			$scope.stopBreak = function(){
				Tasks.stopTask(0);
				$scope.breakTime = false;
			}
		}
	])
	.filter('toTime', function() {
		return function(input) {
			if (typeof input !== "undefined") {
				var m = moment.duration(input);
				return m.get('h') + ":"+ m.get('m') +":"+ m.get('s');
			}
		};
	}).
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
		createTask: function(task, type) {
			if (typeof type == "undefined") {
				type = 'work';
			}
			this.tasks.unshift({
				"name": task.name,
				"estimate": task.estimate,
				"type": type,
				"times": [],
				"total": 0
			});
			this.persist();
		},
		startTask : function(index) {
			var start = moment().valueOf();
			this.tasks[index].times.push({
				"start": start,
				"end" : null
			});
			this.tasks[index].running = true;
			this.persist();
		},
		runningTime: function(index){
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

		calculateTime: function(index){
			var task = this.tasks[index];
			task.total = 0;
			for (var x = task.times.length - 1; x >= 0; x--) {
				task.times[x].total = task.times[x].end - task.times[x].start;
				task.total += task.times[x].total;
			}
		},
		getWorkTimes: function(){
			var workHrs = {};
			for (var x = this.tasks.length - 1; x >= 0; x--) {
				var task = this.tasks[x];
				if (task.type == "work") {
					// get days worked on
					for (var i = task.times.length - 1; i >= 0; i--) {
						var date = new Date(task.times[i].start);
					};
					var date = new Date()
				}
			}
		},
		getDailyTimes: function() {

		}

	};
})
	.factory('test', ['test',
		function(test) {
			return function name() {

			};
		}
	]);