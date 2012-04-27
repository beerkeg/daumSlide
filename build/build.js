/*jshint regexp: false, node: true */
(function () {
    'use strict';

    var http = require('http'),
        async = require('async'),
        clc = require('cli-color'),
        fs = require('fs'),
        compressor = require('node-minify');

    function error() {
        console.error(clc.red(Array.prototype.join.call(arguments, ' ')));
    }

    var fileList = exports.fileList = [
                'http://m1.daumcdn.net/svc/attach/U0301/cssjs/ejohn/class-0.1.0.min.js',
                'http://m1.daumcdn.net/svc/attach/U0301/cssjs/gesture/gesture-1.0.3.js',
                'datasource.js',
                'util.js',
                'panel.js',
                'container.js',
                'observable.js',
                'slide.js'
            ];

    var build = exports.upload = function (destFileName, fileList, callback) {
        var files = [];

        function isReadAllfiles() {
            for(var i = 0, len = files.length; i<len; i++) {
                if (!files[i]) {
                    return false;
                }
            }
            return true;
        }

        function isRemoteFile(filename) {
            return (/(https?):\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/).test(filename);
        }

        function readRemoteFile(filename, index, cb) {
            var value = filename.replace(/(https?):\/\//,""),
                i = value.indexOf("/");

            var fileReq = http.request({
                host: value.substring(0, i),
                port: 80,
                path: value.substring(i),
                method: 'GET'
            }, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    if (files[index]) {
                        files[index] += data;
                    } else {
                        files[index] = data;
                    }
                });
                res.on('end', function () {
                    if (isReadAllfiles()) {
                        cb(null);
                    }
                });
                res.on('error', function (err) {
                    cb(err);
                });
            });
            fileReq.on('error', function (err) {
                error('problem with uploadUrl request: ' + err.message);
                cb(err);
            });
            fileReq.end();
        }
        function readLocalFile(filename, index, cb) {
            var filepath = __dirname + "/../src/main/webapp/js/" + filename;
            fs.readFile(filepath, "utf-8", function (err, data) {
                if (err) {
                    cb(err);
                } else {
                    files[index] = data;
                    if (isReadAllfiles()) {
                        cb(null);
                    }
                }
            });
        }

        // STEP #1. read file from fileList
        function readFile(cb) {
            var callFile = [];
            fileList.forEach(function (filename, index) {
                if (isRemoteFile(filename)) {
                    readRemoteFile(filename, index, cb);
                } else {
                    readLocalFile(filename, index, cb);
                }
            });
        }
        
        // STEP #2. merge files to "slide.merged.js"
        function mergefiles(cb) {
            var filepath = __dirname + "/"+destFileName+".merged.js";
            fs.writeFile(filepath, files.join("\n\n\n"), "utf-8", function (err) {
                if (err) {
                    cb(err);
                } else {
                    fs.readFile(filepath, "utf-8", function (err, data) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, data);
                        }
                    });
                }
            });
        }

        // STEP #3 minify "slide.merged.js" to "slide.min.js"
        function minifyFile(data, cb) {
            // try {
            //     new compressor.minify({
            //         type: 'yui',
            //         fileIn: __dirname + "/"+destFileName+".merged.js",
            //         fileOut: __dirname + "/"+destFileName+".min.js",
            //         callback: function(err){
            //             if (err) {
            //                 cb(err);
            //             } else {
            //                 cb(null);
            //             }
            //         }
            //     });
            // } catch (err) {
            //     cb(err);
            // }
            var command = "uglifyjs --output " +
                            __dirname + "/"+destFileName+".min.js " +
                            __dirname + "/" + destFileName + ".merged.js";
            console.log(command);
            require('child_process').exec(command, function (error, stdout, stderr){
                if (error !== null) {
                  console.error(error.stack);
                }
            });
        }

        async.waterfall([
            readFile,
            mergefiles,
            minifyFile
        ], callback);
    };

    build("slide", fileList, function(err){
        if (err) {
            error("error :");
            console.error(err.stack);
        }
    });
})();