angular.module('templates-main', ['app/header.tpl.html', 'app/report/report.tpl.html', 'app/tasks.tpl.html']);

angular.module("app/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/header.tpl.html",
    "<div>\n" +
    "	<h1 class=\"text-center\">\n" +
    "\n" +
    "		Simple Task Timer\n" +
    "	</h1>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "	<div class=\"col-xs-12\">\n" +
    "		<div class=\"action-buttons text-center\">\n" +
    "			<ul>\n" +
    "				<li>\n" +
    "					<a href class=\"action no-margin\" ng-click=\"settings = !settings\"><i class=\"fa fa-bars\"></i></a>\n" +
    "				</li>\n" +
    "				<li>\n" +
    "					<a href class=\"action no-margin\" ng-click=\"addTask = !addTask\"><i class=\"fa fa-plus\"></i></a>\n" +
    "				</li>\n" +
    "				<li>\n" +
    "					<a class=\"action no-margin\" href ng-hide=\"breakTime\" ng-click=\"startBreak()\"><i class=\"fa fa-coffee\"></i></a>\n" +
    "					<a class=\"action no-margin\" href ng-hide=\"!breakTime\" ng-class=\"{'running': breakTime}\" ng-click=\"stopBreak()\"><i class=\"fa fa-coffee\"></i></a>\n" +
    "				</li>\n" +
    "			</ul>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"settings\" class=\"action-slide\">\n" +
    "	<ul class=\"nav nav-pills\">\n" +
    "		<li><a href=\"#/\">Tasks</a></li>\n" +
    "		<li><a href ng-click=\"getWorkTimes()\">GetTimes</a></li>\n" +
    "		<li><a href=\"#/report\">Report</a></li>\n" +
    "	</ul>\n" +
    "	Worked: {{worktimes.work | toTime}}\n" +
    "	Breaks: {{worktimes.breaktime | toTime}}\n" +
    "</div>\n" +
    "\n" +
    "<form ng-show=\"addTask\" action method=\"POST\" name=\"taskForm\" class=\"form-inline action-slide\" role=\"form\" novalidate>\n" +
    "	<div class=\"form-group\">\n" +
    "		<label for=\"inputTaskName\" class=\"sr-only\">Task Name:</label>\n" +
    "		<div class=\"\">\n" +
    "			<input type=\"text\" name=\"taskName\" id=\"inputTaskName\" ng-model=\"task.name\" class=\"form-control\" placeholder=\"Task Description\" required=\"required\">\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"form-group\">\n" +
    "		<label for=\"inputEstimatedTime\" class=\"sr-only\">Estimated Time:</label>\n" +
    "		<div class=\"\">\n" +
    "			<input type=\"text\" name=\"EstimatedTime\" id=\"inputEstimatedTime\" ng-model=\"task.estimate\" class=\"form-control\" placeholder=\"Estimated time\" required=\"required\">\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"form-group\">\n" +
    "		<div class=\"\">\n" +
    "			<button ng-click=\"createTask(task)\" ng-disabled=\"!taskForm.$valid\" class=\"btn btn-primary\">Submit</button>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</form>\n" +
    "");
}]);

angular.module("app/report/report.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/report/report.tpl.html",
    "<h1>Reporting</h1>\n" +
    "<ul class=\"list-unstyled\">\n" +
    "	<li ng-repeat=\"day in results | orderBy:'Date':true\">\n" +
    "		<div class=\"page-header\">\n" +
    "		  <h3>{{day.Date}} <span class=\"small-heading\">{{day.TotalTime | toTime}}</span></h3>\n" +
    "		</div>\n" +
    "		<ul class=\"list-unstyled\">\n" +
    "			<li ng-repeat=\"entry in day.Entries\">\n" +
    "				 {{entry.total | toTime}} - {{entry.taskName}}\n" +
    "			</li>\n" +
    "		</ul>\n" +
    "	</li>\n" +
    "	<li style=\"margin-bottom: 20px;\"></li>\n" +
    "</ul>");
}]);

angular.module("app/tasks.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/tasks.tpl.html",
    "<div class=\"row\">\n" +
    "	<div class=\"col-xs-12\">\n" +
    "		<ul class=\"list-unstyled\">\n" +
    "			<li class=\"task\" ng-repeat=\"task in tasks track by $index\" ng-hide=\"task.archived\" ng-class=\"{'day-seperator': task.newDay, 'running': task.running}\" >\n" +
    "				<div class=\"row\">\n" +
    "					<div class=\"col-xs-12 col-sm-8\">\n" +
    "						<div class=\"task-description\">\n" +
    "							<div>\n" +
    "								<h3>{{task.name}}&nbsp;\n" +
    "									<span class=\"small\" ng-hide=\"task.running\">{{task.total | toTime}} </span>\n" +
    "									<span class=\"small\" ng-show=\"task.running\">{{ task.runningTime | toTime}}</span>\n" +
    "								</h3>\n" +
    "							</div>\n" +
    "							<div><a href ng-click=\"displayTimes = !displayTimes\">{{task.times.length}} time entries</a></div>\n" +
    "							<div>{{task.estimate}} hrs estimated {{task.type}}</div>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "					<div class=\"col-xs-12 col-sm-4\">\n" +
    "						<div class=\"action-buttons\">\n" +
    "							<ul>\n" +
    "								<li>\n" +
    "									<a class=\"action\" ng-show=\"!task.running\" href ng-click=\"startTask($index)\"><i class=\"fa fa-play\"></i></a>\n" +
    "									<a class=\"action\" ng-show=\"task.running\" href ng-click=\"stopTask($index)\"><i class=\"fa fa-stop\"></i></a>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<a class=\"action\" href ng-click=\"archiveTask($index)\"><i class=\"fa fa-check\"></i></a>\n" +
    "								</li>\n" +
    "							</ul>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "				<div class=\"row\" ng-show=\"displayTimes\">\n" +
    "					<div class=\"col-xs-12\">\n" +
    "						<ul class=\"list-unstyled\">\n" +
    "							<li ng-repeat=\"time in task.times track by $index | orderBy: 'start' : true\" class=\"timeslot\">\n" +
    "\n" +
    "								<input ng-model=\"time.start\" ng-change=\"updateTime(time, task)\"> ->\n" +
    "								<input ng-model=\"time.end\" ng-change=\"updateTime(time, task)\"> =\n" +
    "								{{time.total | toTime}}\n" +
    "							</li>\n" +
    "						</ul>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</li>\n" +
    "		</ul>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
