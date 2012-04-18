/*jshint regexp: false, node: true */
(function () {
    'use strict';

    var http = require('http'),
        async = require('async'),
        clc = require('cli-color'),
        fs = require('fs'),
        jsp = require('uglify-js').parser,
		pro = require('uglify-js').uglify;

    function error() {
        console.error(clc.red(Array.prototype.join.call(arguments, ' ')));
    }

    var fileList = [
                'http://m1.daumcdn.net/svc/attach/U0301/cssjs/gesture/gesture-1.0.0.min.js',
                'http://m1.daumcdn.net/svc/attach/U0301/cssjs/ejohn/class-0.1.0.min.js',
                'datasource.js',
                'util.js',
                'panel.js',
                'container.js',
                'observable.js',
                'slide.js'
            ];

    var upload = exports.upload = function (fileList, callback) {

        function checkfiles(files) {
            for(var i = 0, len = files.length; i<len; i++) {
                if (!files[i]) {
                    return false;
                }
            }
            return true;
        }
        // STEP #1. read file from fileList
        function readFiles(cb) {
            var files = [];
            fileList.forEach(function (filename, index) {
                if (filename.indexOf("http://") > -1) {
                    var value = filename.replace("http://",""),
                        i = value.indexOf("/");

                    var fileReq = http.request({
                        host: value.substring(0, i),
                        port: 80,
                        path: value.substring(i),
                        method: 'GET'
                    }, function (res) {
                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                            files[index] = chunk;
                            if (checkfiles(files)) {
                                cb(null, files);
                            }
                        });
                    });
                    fileReq.on('error', function (e) {
                        error('problem with uploadUrl request: ' + e.message);
                        cb(e);
                    });
                    fileReq.end();
                } else {
                    var filepath = __dirname + "/../src/main/webapp/js/" + filename;
                    files[index] = fs.readFileSync(filepath, "utf-8");
                    if (checkfiles(files)) {
                        cb(null, files);
                    }
                }
            });
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