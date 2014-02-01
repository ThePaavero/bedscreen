
module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.name %>\n <%= grunt.template.today("yyyy-mm-dd") %>\n Author:<%= pkg.author %>\n License: <%= pkg.license %>\n*/\n',
		uglify: {
			'options': {
			},
			'minify-custom-scripts': {
				files: {
					'assets/autoloads.min.js': ['assets/js/main.js', 'assets/js/autoload/**/*.js']
				}
			}
		},
		sass: {
			dist: {
				files: {
					'assets/css/project.css': ['assets/scss/*.scss', 'assets/scss/**/*.scss']
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'assets/css/project.min.css': ['assets/css/project.css']
				}
			}
		},
		watch: {
			scss: {
				files: 'assets/scss/**/*.scss',
				tasks: ['sass', 'cssmin']
			},
			css: {
				files: 'assets/css/proejct.css',
				tasks: ['cssmin']
			},
			js: {
				files: ['assets/js/**/*.js'],
				tasks : ['uglify']
			},
			options: {
				livereload: false
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['uglify', 'sass', 'cssmin', 'watch']);
};
