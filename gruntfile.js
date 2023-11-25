module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    // Uglify JavaScript
    uglify: {
      options: {
        mangle: false, // Preserve variable names
      },
      my_target: {
        files: {
          "dist/script.js": ["src/*.js"],
        },
      },
    },

    // Sass compilation task
    sass: {
      options: {
        sourcemap: "none",
        style: "expanded", // Set to "compressed" for minified output
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: "src",
            src: ["*.css"],
            dest: "dist",
            ext: ".css",
          },
        ],
      },
    },

    // Minify CSS
    cssmin: {
      options: {
        processImport: false,
        noAdvanced: true,
      },
      target: {
        expand: true,
        cwd: "dist",
        src: ["*.css"],
        dest: "dist",
        ext: ".css",
      },
    },

    // Copy files to the dist directory
    copy: {
      main: {
        files: [
          { expand: true, cwd: "src", src: ["*.html"], dest: "dist/" },
          { expand: true, cwd: "src", src: ["*.png"], dest: "dist/" },
          { expand: true, cwd: "src", src: ["favicon.ico"], dest: "dist/" },
        ],
      },
    },

    // Clean task
    clean: {
      dist: ["dist"],
    },

    // Watch task
    watch: {
      scripts: {
        files: ["src/*.js", "src/*.css", "src/*.html"],
        tasks: ["prod"],
        options: {
          spawn: false,
        },
      },
    },

    // Connect task
    connect: {
      server: {
        options: {
          port: 9000,
          base: "dist",
          livereload: true,
        },
      },
    },
  });

  // Load grunt plugins
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-connect");

  // Default task
  grunt.registerTask("default", ["prod", "connect", "watch"]);

  // Production task
  grunt.registerTask("prod", ["clean", "sass", "uglify", "cssmin", "copy"]);
};
