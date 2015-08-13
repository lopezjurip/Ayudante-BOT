/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/mkdirp/mkdirp.d.ts"/>
/// <reference path="../../typings/es6-promise/es6-promise.d.ts"/>
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
            return path_1.resolve(process.env.OPENSHIFT_TMP_DIR || './temp', this.owner, this.name);
        },
        enumerable: true,
        configurable: true
    });
    Repository.prototype.download = function (path) {
        var _this = this;
        return this.repo.contents(path).fetch().then(function (contents) {
            var collection = (contents instanceof Array) ? contents : [contents];
            return Promise.all(collection.map(function (content) {
                if (content.type === 'dir') {
                    return _this.download(content.path);
                }
                else {
                    return content.fetch().then(function (result) {
                        var writePath = path_1.resolve(_this.dir, result.path);
                        writeFileSync(writePath, result.content, result.encoding);
                        return { relative: content.path, full: writePath };
                    }).catch(function (err) {
                        console.log('Download ---------------------');
                        console.log('From:', path);
                        console.log('Success:', 'Fail');
                        console.log('Error:', err);
                        console.log('------------------------------');
                    });
                }
            }));
        }).then(function (result) {
            function flatten(arr) {
                return arr.reduce(function (flat, toFlatten) {
                    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
                }, []);
            }
            return flatten(result);
        }).catch(function (err) {
            console.log(err);
        });
    };
    Repository.prototype.fetchTree = function () {
        var _this = this;
        return this.fetchHead().then(function (commit) {
            _this.head = commit;
            return _this.repo.git.trees(commit.object.sha).fetch();
        });
    };
    Repository.prototype.fetchHead = function (branch) {
        if (branch === void 0) { branch = 'master'; }
        return this.repo.git.refs.heads(branch).fetch();
    };
    Repository.prototype.commitFiles = function (files, message, branch) {
        var _this = this;
        if (branch === void 0) { branch = 'master'; }
        return Promise.all(files.map(function (file) {
            return _this.repo.git.blobs.create({
                content: file.content,
                encoding: file.encoding
            });
        })).then(function (blobs) {
            return _this.fetchTree().then(function (tree) {
                return _this.repo.git.trees.create({
                    tree: files.map(function (file, index) {
                        return {
                            path: file.path,
                            mode: '100644',
                            type: 'blob',
                            sha: blobs[index].sha
                        };
                    }),
                    base_tree: tree.sha
                });
            });
        }).then(function (tree) {
            return _this.repo.git.commits.create({
                message: message,
                tree: tree.sha,
                parents: [
                    _this.head.object.sha
                ]
            });
        }).then(function (commit) {
            return _this.repo.git.refs.heads(branch).update({
                sha: commit.sha
            });
        }).then(function (result) {
            return result;
        });
    };
    return Repository;
})();
exports.Repository = Repository;
