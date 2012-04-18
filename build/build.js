/*jshint regexp: false, node: true */
(function () {
    'use strict';

    var async = require('async'),
        clc = require('cli-color'),
        fs = require('fs'),
        jsp = require("uglify-js").parser,
		pro = require("uglify-js").uglify;

    function error() {
        console.error(clc.red(Array.prototype.join.call(arguments, ' ')));
    }

    var fileList = [
                'datasource.js',
                'util.js',
                'panel.js',
                'container.js',
                'observable.js',
                'slide.js'
            ];

    var upload = exports.upload = function (fileList, callback) {

        // STEP #1. read file from fileList
        function readFiles(cb) {
            var files = [];
            fileList.forEach(function (filename) {
                var filepath = __dirname + "/../src/main/webapp/js/" + filename;
                files.push(fs.readFileSync(filepath, "utf-8"));
            });
            console.log(files);
            cb(null, files);
        }
        
        // STEP #2. merge files
        function mergefiles(files, cb) {
            var filepath = __dirname + "/slide.merged.js";
            fs.writeFile(filepath, files.join(""), "utf-8", function (err) {
                if (err) {
                    cb(err);
                    return ;
                } 
                var file = fs.readFileSync(filepath, "utf-8");
                cb(null, file);
            });
        }

        // STEP #3 minify "slide.merged.js"
        function minifyFile(file, cb) {
            var ast = jsp.parse(file); // parse code and get the initial AST
            ast = pro.ast_mangle(ast); // get a new AST with mangled names
            ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
            var final_code = pro.gen_code(ast); // compressed code here
            cb(final_code);
        }

        async.waterfall([
            readFiles,
            mergefiles,
            minifyFile
        ], callback);
    };

    upload(fileList, function(data){
        var filepath = __dirname + "/slide.min.js";
        fs.writeFile(filepath, data, "utf-8", function (err) {
            if (err) {
                error(err);
                return ;
            } 
        });
    });
})();