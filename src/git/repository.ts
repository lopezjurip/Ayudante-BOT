/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/mkdirp/mkdirp.d.ts"/>

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

    constructor(repo: any, owner: string, name: string) {
        this.repo = repo;
        this.owner = owner;
        this.name = name;
    }

    get dir(): string {
        return resolve(process.env.OPENSHIFT_TMP_DIR, this.owner, this.name);
    }

    download(path: string, perFileCallback?: (err: any, relative: string, full: string) => void) {
        this.repo.contents(path).fetch().then(contents => {
            let collection: any[] = (contents instanceof Array) ? contents : [contents]
            collection.forEach(content => {
                if (content.type === 'dir') {
                    this.download(content.path, perFileCallback)
                } else {
                    content.fetch().then(result => {
                        let writePath = resolve(this.dir, result.path)
                        writeFileSync(writePath, result.content, result.encoding)

                        console.log('Download ---------------------')
                        console.log('From:', path)
                        console.log('To:', writePath)
                        console.log('Status:', 'Success')
                        console.log('------------------------------')

                        if (perFileCallback) perFileCallback(undefined, content.path, writePath)
                    }).catch(err => {
                        console.log('Download ---------------------')
                        console.log('From:', path)
                        console.log('Success:', 'Fail')
                        console.log('Error:', err)
                        console.log('------------------------------')
                    })
                }
            })
        }).catch(err => {
            console.log(err)
        })
    }

    uploadFile(frm: string, destination: string, message: string, callback?: (err: any, result: any) => void) {
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

    private updateFile(frm: string, destination: string, message: string, sha: string, callback?: (err: any, result: any) => void) {
        const base64data = fs.readFileSync(frm).toString('base64');
        const config = {
            message: message,
            content: base64data,
            sha: sha,
        };
        this.commitFile(frm, destination, config, callback);
    }

    private writeFile(frm: string, destination: string, message: string, callback?: (err: any, result: any) => void) {
        const base64data = fs.readFileSync(frm).toString('base64');
        const config = {
            message: message,
            content: base64data,
        };
        this.commitFile(frm, destination, config, callback);
    }

    private commitFile(frm: string, destination: string, config, callback?: (err: any, result: any) => void) {
        console.log('Commit ---------------------')
        console.log('From:', frm)
        console.log('To:', destination)
        console.log('SHA:', config.sha)

        return this.repo.contents(destination).add(config).then(info => {
            console.log('Status:', 'Success')
            console.log('------------------------------')
            callback(undefined, info);
            fs.unlinkSync(frm);

        }).catch(err => {
            console.log('Status:', 'Fail')
            console.log('Error:', err)
            console.log('------------------------------')
            callback(err, undefined);
            fs.unlinkSync(frm);
        });
    }
}
