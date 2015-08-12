/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/mkdirp/mkdirp.d.ts"/>

import {resolve, dirname} from 'path'
import {Person} from "../models/models";
import mkdirp = require("mkdirp");
import fs = require('fs')

function writeFile(path: string, data: string, encoding: string, callback: (err: any, made: string) => void) {
    mkdirp(dirname(path), (err, made) => {
        if (err) return callback(err, made);
        fs.writeFile(path, new Buffer(data, encoding), callback);
    });
}

export default class Repository {
    repo: any
    owner: Person
    name: string

    constructor(repo: any, owner: Person, name: string) {
        this.repo = repo;
        this.owner = owner;
        this.name = name;
    }

    get dir(): string {
        return resolve('.', 'temp', this.owner, this.name);
    }

    download(path: string, perFileCallback: (err: any, relative: string, full: string) => void = undefined) {
        this.repo.contents(path).fetch().then(contents => {
            contents = (contents instanceof Array) ? contents : [contents]
            contents.forEach(content => {
                if (content.type === 'dir') {
                    this.download(content.path, perFileCallback)
                } else {
                    content.fetch().then(result => {
                        let writePath = resolve(this.dir, result.path)
                        writeFile(writePath, result.content, result.encoding, (err, made) => {
                            if (err) console.log('Writting file error:', err)
                            if (perFileCallback) perFileCallback(err, content.path, writePath)
                        })
                    })
                }
            })
        }).catch(err => {
            console.log(err)
        })
    }

    uploadFile(frm: string, destination: string, message: string, callback = undefined) {
        this.repo.contents(destination).fetch().then(contents => {
            // Will override
            this.updateFile(frm, destination, message, contents.sha, callback);

        }).catch(err => {
            if (err.status === 404) {
                // Will create
                this.writeFile(frm, destination, message, callback);
            } else {
                console.log(err);
            }
        });
    }

    private updateFile(frm: string, destination: string, message: string, sha: string, callback = undefined) {
        const base64data = fs.readFileSync(frm).toString('base64');
        const config = {
            message: message,
            content: base64data,
            sha: sha,
        };
        this.commitFile(frm, destination, config, callback);
    }

    private writeFile(frm: string, destination: string, message: string, callback = undefined) {
        const base64data = fs.readFileSync(frm).toString('base64');
        const config = {
            message: message,
            content: base64data,
        };
        this.commitFile(frm, destination, config, callback);
    }

    private commitFile(frm: string, destination: string, config, callback = undefined) {
        return this.repo.contents(destination).add(config).then(info => {
            callback(info, undefined);
            fs.unlinkSync(frm);

        }).catch(err => {
            callback(undefined, err);
            fs.unlinkSync(frm);
        });
    }
}
