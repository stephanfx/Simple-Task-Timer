module.exports = function(grunt) {

	// load the tasks
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-html2js');

	// configure the tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
			' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
			' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
		pubDir: 'dist/www',
		clean: ['<%= pubDir %>'],
		concat: {
			dist: {
				options: {
					banner: "<%= banner %>"
				},
				src: ['src/**/*.js'],
				dest: '<%= pubDir %>/static/<%= pkg.name %>.js'
			},
			index: {
				src: ['src/index.html'],
				dest: '<%= pubDir %>/index.html',
				options: {
					process: true
				}
			},
			styles: {
				src: [
					"vendor/bootstrap/dist/css/bootstrap.css",
					"vendor/bootstrap/dist/css/bootstrap-theme.css"
				],
				dest: '<%= pubDir %>/static/css/vendor.css'
			},
			appstyles: {
				src: [
					"src/css/index.css",
					"src/css/app.css",
				],
				dest: '<%= pubDir %>/static/css/app.css'
			},
			angular: {
				src: [
					'vendor/angular/angular.js',
					'vendor/angular-route/angular-route.js',
					"vendor/angular-animate/angular-animate.js",
					"vendor/moment/moment.js",
				],
				dest: '<%= pubDir %>/static/angular.js'
			},
			bootstrap: {
				src: [
					"vendor/bootstrap/dist/js/bootstrap.js",
					"vendor/bootstrap-datepicker/js/bootstrap-datepicker.js",
				],
				dest: '<%= pubDir %>/static/bootstrap.js'
			},
			jquery: {
				src: ['vendor/jquery/dist/jquery.js'],
				dest: '<%= pubDir %>/static/jquery.js'
			},
		},
		copy: {
			build: {
				cwd: 'src/',
				src: [
					'res/**',
					'phonegap.js',
					'icon.png',
					'config.xml',
				],
				dest: '<%= pubDir %>',
				expand: true
			},
			fonts: {
				cwd: 'vendor/bootstrap/dist/fonts/',
				src: ["**"],
				dest: '<%= pubDir %>/static/fonts/',
				expand: true
			},
			images: {
				cwd: 'src/sandownmobile/img',
				src: ["**"],
				dest: '<%= pubDir %>/static/img/',
				expand: true
			}
		},
		html2js: {
			main: {
				src: ['src/**/*.tpl.html'],
				dest: '<%= pubDir %>/static/templates.js'
			}
		},
		uglify: {
			dist: {
				options: {
					banner: "<%= banner %>"
				},
				src: ['src/app/**/*.js', 'src/sandownmobile/**/*.js'],
				dest: '<%= pubDir %>/static/<%= pkg.name %>.js'
			},
			template: {
				src: ['<%= pubDir %>/static/templates.js'],
				dest: '<%= pubDir %>/static/templates.js'
			},
			angular: {
				src: [
					'vendor/angular/angular.js',
					'vendor/angular-route/angular-route.js',
					'vendor/angular-resource/angular-resource.js',
					"vendor/angular-animate/angular-animate.js",
					"vendor/angular-cookies/angular-cookies.js",
					"vendor/angular-sanitize/angular-sanitize.js",
					"vendor/lodash/dist/lodash.min.js",
					"vendor/restangular/dist/restangular.min.js",
					"vendor/angular-gestures/gestures.min.js",
					"vendor/angular-strap/dist/angular-strap.js",
					"vendor/angular-strap/dist/angular-strap.tpl.js",
					"vendor/angular-gm-master/dist/angular-gm.min.js",
				],
				dest: '<%= pubDir %>/static/angular.js'
			},
			bootstrap: {
				src: [
					"vendor/bootstrap/dist/js/bootstrap.js",

					"vendor/bootstrap-datepicker/js/bootstrap-datepicker.js",
				],
				dest: '<%= pubDir %>/static/bootstrap.js'
			},
			jquery: {
				src: ['vendor/jquery/jquery.js'],
				dest: '<%= pubDir %>/static/jquery.js'
			},
		},

		jshint: {
			files: [
				'Gruntfile.js',
				'src/**/*.js',
			],
			options: {
				globals: {
					module: true,
					angular: true,
					$: true,
					google: true,
					window: true,
					document: true
				}
			},
		},

		watch: {
			files: ['<%= jshint.files %>', 'src/**/*.html', 'src/css/*.css'],
			tasks: ['timestamp', 'default']
		}
	});



	grunt.registerTask('timestamp', function() {
		grunt.log.subhead(Date());
	});


	grunt.registerTask('default', [ 'jshint', 'build']);
	grunt.registerTask('build', ['clean', 'concat', 'html2js', 'copy', ]);
	grunt.registerTask('release', [ 'clean', 'html2js', 'uglify', 'concat:index', 'concat:styles', 'copy',  'cssmin' ]);

};