angular.module('simpleTask', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {

		}
	])
	.controller('TaskCtrl', ['$scope', '$timeout',
		function($scope, $timeout) {
			$scope.tasks = [];
			$scope.load = function() {
				if (localStorage.getItem('tasks')) {
					var tasks = JSON.parse(localStorage.getItem('tasks'));
					console.log(tasks);
					$scope.tasks = tasks;
					$scope.timing();
				}
			};
			$scope.persist = function() {
				if (Storage) {
					localStorage.setItem('tasks', JSON.stringify($scope.tasks));
				}
			};
			$scope.createTask = function() {
				var start = Date.now();
				$scope.tasks.unshift({
					"name": $scope.task.name,
					"start": start
				});
				$scope.persist();
				$scope.task = null;
			};

			$scope.removeTask = function(index) {
				$scope.tasks.splice(index, 1);
				$scope.persist();
			};

			$scope.timeLeft = [];

			$scope.timing = function(){
				$timeout(function(){
					var now = Date.now();
					for (var i = $scope.tasks.length - 1; i >= 0; i--) {
						$scope.timeLeft[i] = now - $scope.tasks[i].start;
					}
					$scope.timing();
				},1000);
			};


			$scope.stopTask = function(index) {
				var task = $scope.tasks[index];
				task.end = Date.now();
				task.total = task.end - task.start;
				$scope.persist();
			};
		}
	])
	.filter('toTime', function() {
		return function(input) {
			if (typeof input !== "undefined"){
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
	});