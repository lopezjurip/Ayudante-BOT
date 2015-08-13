import {Repository} from "./repository";
let Octokat = require('octokat')

export class GitManager {
    octo: any

    constructor(token: string) {
        this.octo = new Octokat({ token: token });
    }

    repo(owner: string, name: string): Repository {
        return new Repository(this.octo.repos(owner, name), owner, name);
    }
}
