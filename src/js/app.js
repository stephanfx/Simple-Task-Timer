angular.module('simpleTask', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){

}])
.controller('TaskCtrl', ['$scope', function($scope){
	$scope.tasks = [];
	$scope.load = function(){
		if (localStorage.getItem('tasks')){
			var tasks = JSON.parse(localStorage.getItem('tasks'));
			console.log(tasks);
			$scope.tasks = tasks;
		}
	};
	$scope.persist = function(){
		if (Storage){
			localStorage.setItem('tasks', JSON.stringify($scope.tasks));
		}
	};
	$scope.createTask = function(){
		var start = Date.now();
		$scope.tasks.unshift({"name":$scope.task.name, "start": start});
		$scope.persist();
		$scope.task = null;
	};

	$scope.removeTask = function(index){
		$scope.tasks.splice(index,1);
		$scope.persist();
	};

	$scope.stopTask = function(index){
		var task = $scope.tasks[index];
		task.end = Date.now();
		task.total = task.end - task.start;
		$scope.persist();
	};
}]);