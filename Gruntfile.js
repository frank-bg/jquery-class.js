
module.exports = function(grunt){

	var banner = grunt.template.process(
		grunt.file.read("src/banner.js"),
		{ data: grunt.file.readJSON("package.json") }
	);


	grunt.initConfig({

		concat: {
			options: { banner: banner },
			dist: {
				files: {
					"dist/jquery-class.js": ["src/jquery-class.js"]
				}
			}
		},

		uglify: {
			options: { banner: banner },
			dist: {
				files: {
					"dist/jquery-class.min.js": ["src/jquery-class.js"]
				}
			}
		}

	});

	grunt.registerTask("default", []);
	grunt.registerTask("build", ["concat:dist", "uglify:dist"]);

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");

};