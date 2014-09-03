angular.module('templates-main', ['app/header.tpl.html', 'app/report/report.tpl.html', 'app/tasks.tpl.html']);

angular.module("app/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/header.tpl.html",
    "<div class=\"page-header\">\n" +
    "\n" +
    "	<h1>\n" +
    "		<a class=\"action no-margin\" href ng-hide=\"breakTime\" ng-click=\"startBreak()\"><span class=\"glyphicon glyphicon-cutlery\"></span></a>\n" +
    "		<a class=\"action no-margin\" href ng-hide=\"!breakTime\" ng-class=\"{'running': breakTime}\" ng-click=\"stopBreak()\"><span class=\"glyphicon glyphicon-cutlery\"></span></a>\n" +
    "		<a href class=\"action no-margin\" ng-click=\"settings = !settings\"><span class=\"glyphicon glyphicon-cog\"></span></a>\n" +
    "		Simple Task Timer\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "	</h1>\n" +
    "\n" +
    "</div>\n" +
    "<div ng-show=\"settings\">\n" +
    "	<ul class=\"nav nav-pills\">\n" +
    "		<li><a href ng-click=\"getWorkTimes()\">GetTimes</a></li>\n" +
    "		<li><a href=\"#/report\">Report</a></li>\n" +
    "		<li><a href=\"#/\">Tasks</a></li>\n" +
    "	</ul>\n" +
    "\n" +
    "	Worked: {{worktimes.work | toTime}}\n" +
    "	Breaks: {{worktimes.breaktime | toTime}}\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<form action method=\"POST\" name=\"taskForm\" class=\"form-inline\" role=\"form\" novalidate>\n" +
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
    "	<li ng-repeat=\"(key, result) in results | orderBy:-key\">\n" +
    "		<div class=\"page-header\">\n" +
    "		  <h3>{{key}}</h3>\n" +
    "		</div>\n" +
    "		<ul class=\"list-unstyled\">\n" +
    "			<li ng-repeat=\"(task, time) in result\">\n" +
    "				 {{time.total | toTime}} - {{task}}\n" +
    "			</li>\n" +
    "		</ul>\n" +
    "	</li>\n" +
    "</ul>");
}]);

angular.module("app/tasks.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app/tasks.tpl.html",
    "<ul class=\"list-unstyled\">\n" +
    "	<li ng-repeat=\"task in tasks track by $index\" ng-hide=\"task.archived\" ng-class=\"{'day-seperator': task.newDay, 'running': task.running}\" >\n" +
    "		<div class=\"row\">\n" +
    "			<div class=\"col-xs-12 col-sm-8\">\n" +
    "				<div style=\"padding: 4px 10px\">\n" +
    "					<div>\n" +
    "						<h3>{{task.name}}&nbsp;\n" +
    "							<span class=\"small\" ng-hide=\"task.running\">{{task.total | toTime}} </span>\n" +
    "							<span class=\"small\" ng-show=\"task.running\">{{ task.runningTime | toTime}}</span>\n" +
    "						</h3>\n" +
    "					</div>\n" +
    "					<div><a href ng-click=\"displayTimes = !displayTimes\">{{task.times.length}} time entries</a></div>\n" +
    "					<div>{{task.estimate}} hrs estimated {{task.type}}</div>\n" +
    "\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			<div class=\"col-xs-12 col-sm-4 text-center\">\n" +
    "				<a class=\"action\" ng-show=\"!task.running\" href ng-click=\"startTask($index)\"><span class=\"glyphicon glyphicon-play\"></span></a>\n" +
    "				<a class=\"action\" ng-show=\"task.running\" href ng-click=\"stopTask($index)\"><span class=\"glyphicon glyphicon-stop\"></span></a>\n" +
    "				<a class=\"action\" href ng-click=\"archiveTask($index)\"><span class=\"glyphicon glyphicon-ok\"></span></a>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"row\" ng-show=\"displayTimes\">\n" +
    "			<div class=\"col-xs-12\">\n" +
    "				<ul class=\"list-unstyled\">\n" +
    "					<li ng-repeat=\"time in task.times track by $index\">\n" +
    "						Time Started: {{time.start | date:\"yyyy-MM-dd HH:mm:ss\"}} |\n" +
    "						Time Ended: {{time.end | date:\"yyyy-MM-dd HH:mm:ss\"}} <br>\n" +
    "					</li>\n" +
    "				</ul>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</li>\n" +
    "</ul>");
}]);
