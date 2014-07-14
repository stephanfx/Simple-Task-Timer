angular.module('simpleTask', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {

		}
	])
	.controller('TaskCtrl', ['$scope', 'Tasks',
		function($scope, Tasks) {
			Tasks.load();
			console.log(Tasks);
			$scope.tasks = Tasks.tasks;
			$scope.createTask = function(task) {
				Tasks.createTask(task);
				$scope.task = null;
			};
			$scope.startTask = function(index) {
				Tasks.startTask(index);
			};
			$scope.stopTask = function(index){
				Tasks.stopTask(index);
			};
			$scope.removeTask = function(index){
				Tasks.removeTask(index);
			};
			timing = function() {
				$timeout(function() {
					var now = Date.now();
					for (var i = tasks.length - 1; i >= 0; i--) {
						timeLeft[i] = now - tasks[i].start;
					}
					timing();
				}, 1000);
			};
		}
	])
	.filter('toTime', function() {
		return function(input) {
			if (typeof input !== "undefined") {
				var milliseconds = parseInt((input % 1000) / 100, 10),
					seconds = parseInt((input / 1000) % 60, 10),
					minutes = parseInt((input / (1000 * 60)) % 60, 10),
					hours = parseInt((input / (1000 * 60 * 60)) % 24, 10);

				hours = (hours < 10) ? "0" + hours : hours;
				minutes = (minutes < 10) ? "0" + minutes : minutes;
				seconds = (seconds < 10) ? "0" + seconds : seconds;

				return hours + ":" + minutes + ":" + seconds;
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
				localStorage.setItem('tasks', JSON.stringify(tasks));
			}
		},
		createTask: function(task) {
			tasks.unshift({
				"name": task.name,
				"estimate": task.estimate,
				"times": []
			});
			this.persist();
			task = null;
		},

		startTask : function(index) {
			var start = Date.now();
			tasks[index].times.push({
				"start": start,
				"end" : null
			});
			tasks[index].running = true;
			this.persist();
		},

		removeTask: function(index) {
			tasks.splice(index, 1);
			this.persist();
		},

		stopTask: function(index) {
			var task = tasks[index],
				timeToStop = task.times.length - 1;
			task.running = false;
			task.times[timeToStop].end = Date.now();
			this.calculateTime(index);
			this.persist();
		},
		calculateTime: function(index){
			var task = tasks[index];
			task.total = 0;
			for (var x = task.times.length - 1; x >= 0; x--) {
				task.total += task.times[x].end - task.times[x].start;
			}
		},

	};
})
	.factory('test', ['test',
		function(test) {
			return function name() {

			};
		}
	]);