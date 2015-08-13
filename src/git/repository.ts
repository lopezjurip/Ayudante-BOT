/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/mkdirp/mkdirp.d.ts"/>
/// <reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import {resolve, dirname} from 'path'
import {Person} from "../models/models";
import mkdirp = require("mkdirp");
import fs = require('fs')

function writeFileSync(path: string, data: string, encoding: string) {
    let made = mkdirp.sync(dirname(path))
    fs.writeFileSync(path, new Buffer(data, encoding))
}

export default class Repository {
    repo: any
    owner: string
    name: string
    head: any

    constructor(repo: any, owner: string, name: string) {
        this.repo = repo;
        this.owner = owner;
        this.name = name;
    }

    get dir(): string {
        return resolve(process.env.OPENSHIFT_TMP_DIR || './temp', this.owner, this.name);
    }

    public download(path: string): Promise<{ relative: string, full: string }[]> {
        return this.repo.contents(path).fetch().then(contents => {
            let collection: any[] = (contents instanceof Array) ? contents : [contents]
            return Promise.all(collection.map(content => {
                if (content.type === 'dir') {
                    return this.download(content.path)
                } else {
                    return content.fetch().then(result => {
                        let writePath = resolve(this.dir, result.path)
                        writeFileSync(writePath, result.content, result.encoding)
                        return { relative: content.path, full: writePath }
                    }).catch(err => {
                        console.log('Download ---------------------')
                        console.log('From:', path)
                        console.log('Success:', 'Fail')
                        console.log('Error:', err)
                        console.log('------------------------------')
                    })
                }
            }))
        }).then(result => {
            function flatten(arr) {
              return arr.reduce(function (flat, toFlatten) {
                return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
              }, []);
            }
            return flatten(result)
        }).catch(err => {
            console.log(err)
        })
    }

    private fetchTree() {
        return this.fetchHead().then(commit => {
            this.head = commit;
            return this.repo.git.trees(commit.object.sha).fetch();
        });
    }

    private fetchHead(branch: string = 'master') {
        return this.repo.git.refs.heads(branch).fetch();
    }

    public commitFiles(files: {path: string, content: any, encoding: string}[], message: string, branch: string = 'master') {
        return Promise.all(files.map(file => {
            return this.repo.git.blobs.create({
                content: file.content,
                encoding: file.encoding
            })
        })).then(blobs => {
            return this.fetchTree().then(tree => {
                return this.repo.git.trees.create({
                    tree: files.map((file, index) => {
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
        }).then(tree => {
            return this.repo.git.commits.create({
                message: message,
                tree: tree.sha,
                parents: [
                    this.head.object.sha
                ]
            });
        }).then(commit => {
            return this.repo.git.refs.heads(branch).update({
                sha: commit.sha
            });
        }).then(result => {
            return result
        });
    }
}
