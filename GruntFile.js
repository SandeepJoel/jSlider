module.exports = function(grunt){
	grunt.initConfig({
		uglify: {
			js:{
				files: {
				  'js/slider.min.js': ['js/slider.js']
				}
			}
		},
		compass: {                  // Task 
		  dev: {                    // Another target 
		    options: {
		      sassDir: 'scss',
		      cssDir: 'css'
		    }
		  }
		},
		watch: {
		  css: {
		    files: ['scss/*.scss'],
		    tasks: ['compass:dev','show_date_time'],
		    options: {
		      spawn: false,
		    },
		  },
		  scripts:{
		  	files:['js/slider.js'],
		  	tasks: ['show_date_time']
		  }
		}
	});
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('show_date_time','Task to just display date and time',function(){
		grunt.log.writeln(Date());
	});
};