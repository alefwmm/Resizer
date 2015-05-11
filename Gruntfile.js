module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            default: {
                files: {
                    'dist/Resizer.min.js': 'src/Resizer.js'
                }
            }
        },
        jade: {
            default: {
                files: {
                    'demo/index.html': 'demo/index.jade'
                }
            }
        },
        watch: {
            jade: {
                files: "demo/index.jade",
                tasks: "jade"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['jade', 'uglify']);
};
