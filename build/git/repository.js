/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/mkdirp/mkdirp.d.ts"/>
var path_1 = require('path');
var mkdirp = require("mkdirp");
var fs = require('fs');
function writeFileSync(path, data, encoding) {
    var made = mkdirp.sync(path_1.dirname(path));
    fs.writeFileSync(path, new Buffer(data, encoding));
}
var Repository = (function () {
    function Repository(repo, owner, name) {
        this.repo = repo;
        this.owner = owner;
        this.name = name;
    }
    Object.defineProperty(Repository.prototype, "dir", {
        get: function () {
            return path_1.resolve(process.env.OPENSHIFT_TMP_DIR, this.owner, this.name);
        },
        enumerable: true,
        configurable: true
    });
    Repository.prototype.download = function (path, perFileCallback) {
        var _this = this;
        this.repo.contents(path).fetch().then(function (contents) {
            var collection = (contents instanceof Array) ? contents : [contents];
            collection.forEach(function (content) {
                if (content.type === 'dir') {
                    _this.download(content.path, perFileCallback);
                }
                else {
                    content.fetch().then(function (result) {
                        var writePath = path_1.resolve(_this.dir, result.path);
                        writeFileSync(writePath, result.content, result.encoding);
                        console.log('Download ---------------------');
                        console.log('From:', path);
                        console.log('To:', writePath);
                        console.log('Status:', 'Success');
                        console.log('------------------------------');
                        if (perFileCallback)
                            perFileCallback(undefined, content.path, writePath);
                    }).catch(function (err) {
                        console.log('Download ---------------------');
                        console.log('From:', path);
                        console.log('Success:', 'Fail');
                        console.log('Error:', err);
                        console.log('------------------------------');
                    });
                }
            });
        }).catch(function (err) {
            console.log(err);
        });
    };
    Repository.prototype.uploadFile = function (frm, destination, message, callback) {
        var _this = this;
        this.repo.contents(destination).fetch().then(function (contents) {
            _this.updateFile(frm, destination, message, contents.sha, callback);
        }).catch(function (err) {
            if (err.status === 404) {
                _this.writeFile(frm, destination, message, callback);
            }
            else {
                console.log(err);
            }
        });
    };
    Repository.prototype.updateFile = function (frm, destination, message, sha, callback) {
        var base64data = fs.readFileSync(frm).toString('base64');
        var config = {
            message: message,
            content: base64data,
            sha: sha,
        };
        this.commitFile(frm, destination, config, callback);
    };
    Repository.prototype.writeFile = function (frm, destination, message, callback) {
        var base64data = fs.readFileSync(frm).toString('base64');
        var config = {
            message: message,
            content: base64data,
        };
        this.commitFile(frm, destination, config, callback);
    };
    Repository.prototype.commitFile = function (frm, destination, config, callback) {
        console.log('Commit ---------------------');
        console.log('From:', frm);
        console.log('To:', destination);
        console.log('SHA:', config.sha);
        return this.repo.contents(destination).add(config).then(function (info) {
            console.log('Status:', 'Success');
            console.log('------------------------------');
            callback(undefined, info);
            fs.unlinkSync(frm);
        }).catch(function (err) {
            console.log('Status:', 'Fail');
            console.log('Error:', err);
            console.log('------------------------------');
            callback(err, undefined);
            fs.unlinkSync(frm);
        });
    };
    return Repository;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Repository;
