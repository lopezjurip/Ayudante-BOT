/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/mkdirp/mkdirp.d.ts"/>
var path_1 = require('path');
var mkdirp = require("mkdirp");
var fs = require('fs');
function writeFile(path, data, encoding, callback) {
    mkdirp(path_1.dirname(path), function (err, made) {
        if (err)
            return callback(err, made);
        fs.writeFile(path, new Buffer(data, encoding), callback);
    });
}
var Repository = (function () {
    function Repository(repo, owner, name) {
        this.repo = repo;
        this.owner = owner;
        this.name = name;
    }
    Object.defineProperty(Repository.prototype, "dir", {
        get: function () {
            return path_1.resolve('.', 'temp', this.owner, this.name);
        },
        enumerable: true,
        configurable: true
    });
    Repository.prototype.download = function (path, perFileCallback) {
        var _this = this;
        if (perFileCallback === void 0) { perFileCallback = undefined; }
        this.repo.contents(path).fetch().then(function (contents) {
            contents = (contents instanceof Array) ? contents : [contents];
            contents.forEach(function (content) {
                if (content.type === 'dir') {
                    _this.download(content.path, perFileCallback);
                }
                else {
                    content.fetch().then(function (result) {
                        var writePath = path_1.resolve(_this.dir, result.path);
                        writeFile(writePath, result.content, result.encoding, function (err, made) {
                            if (err)
                                console.log('Writting file error:', err);
                            if (perFileCallback)
                                perFileCallback(err, content.path, writePath);
                        });
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
        return this.repo.contents(destination).add(config).then(function (info) {
            callback(undefined, info);
            fs.unlinkSync(frm);
        }).catch(function (err) {
            callback(err, undefined);
            fs.unlinkSync(frm);
        });
    };
    return Repository;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Repository;
