/// <reference path="../typings/node-telegram-bot-api/TelegramBot.d.ts"/>
/// <reference path="../typings/node/node.d.ts"/>

import {resolve} from 'path'
import * as fs from 'fs';
import {TelegramTypedBot as Bot, IServerOptions, BotAction} from './bot/telegram-typed-bot';
import {loadStudents, loadAssistents} from './models/parser';
import {Assistent, Student, Person} from './models/models';
import Repository from "./git/repository";
import {GitManager} from "./git/git-mananger";

export import t = require('./bot/telegram-bot-typings')

export interface AyudanteBOTOptions {
    github: string
    tokens: { telegram: string, github: string }
    server: IServerOptions
}

interface ISearchOptions {
    text?: string
}

interface ISearchStudentOptions extends ISearchOptions {
    section?: number
    quitted?: boolean
}

interface ISearchAssistentOptions extends ISearchOptions {
    area?: string
    level?: string
}

export interface Repositories {
    syllabus: Repository
    private: Repository
    starter: Repository
}

export class AyudanteBOT extends Bot {
    github: string
    gitmanager: GitManager
    repositories: Repositories
    students: Student[]
    assistents: Assistent[]

    constructor(options: AyudanteBOTOptions) {
        super(options.tokens.telegram, options.server)

        this.gitmanager = new GitManager(options.tokens.github)

        this.github = options.github
        this.repositories = {
            syllabus: this.gitmanager.repo(this.github, 'syllabus'),
            private: this.gitmanager.repo(this.github, 'private'),
            starter: this.gitmanager.repo(this.github, 'starter')
        }
        this.students = loadStudents(resolve('.', 'data', 'students.csv'))
        this.assistents = loadAssistents(resolve('.', 'data', 'assistents.csv'))
    }

    get githubUrl(): string {
        return 'https://github.com/' + this.github;
    }

    get syllabusUrl(): string {
        return this.githubUrl + '/syllabus'
    }

    get privateUrl(): string {
        return this.githubUrl + '/private'
    }

    get starterUrl(): string {
        return this.githubUrl + '/starter'
    }

    personGithubURLinOrganization(person: Person): string {
        return this.githubUrl + '/' + person.github;
    }

    studentPrivateRepository(person: Person): Repository {
        return this.gitmanager.repo(this.github, person.github)
    }

    publishActivity(number: number): Promise<string> {
        const twoDigit = (number < 10) ? '0' + number : '' + number;
        const path = `Actividades/AC${twoDigit}/Enunciado/Release/`;
        const message = `[BOT] Publicada AC${twoDigit}`;
        return this.publish(path, message);
    }

    publishHomework(number: number): Promise<string> {
        const twoDigit = (number < 10) ? '0' + number : '' + number;
        const path = `Tareas/T${twoDigit}/Enunciado/Release/`;
        const message = `[BOT] Publicada T${twoDigit}`;
        return this.publish(path, message);
    }

    publish(path: string, message: string): Promise<string> {
        return this.repositories.private.download(path).then(results => {
            return this.repositories.syllabus.commitFiles(results.map(item => {
                return {
                    path: item.relative.replace('/Enunciado/Release', ''),
                    content: fs.readFileSync(item.full).toString('base64'),
                    encoding: 'base64'
                }
            }), message).then(commit => {
                results.map(r => r.full).forEach(fs.unlinkSync)
                return commit
            })
        }).then(commit => {
            return commit.object.url
        })
    }

    recollect() {
        return Promise.all(this.students.filter(s => s.quitted).map(student => {
            let repo = this.studentPrivateRepository(student)
            return repo.download('path: string').then(files => {
                return {student: student, files: files}
            })
        })).then(result => {
            /*
            function flatten<T>(arr) : T[] {
                return arr.reduce(function(flat, toFlatten) {
                    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
                }, []);
            }
            let files = flatten<{relative: string, full: string}>(result).map(item => {
                return {
                    path: 'Actividades/AC01/Corrección/',
                    content: fs.readFileSync(item.full).toString('base64'),
                    encoding: 'base64'
                }
            })
            */
        });
    }

    searchStudent(o: ISearchStudentOptions): Student[] {
        const filtered = this.students.filter(a => {
            if (o.section !== undefined && a.section !== o.section) return false
            if (o.quitted !== undefined && a.quitted !== o.quitted) return false
            return true
        })

        return this.searchPerson(filtered, o.text)
    }

    searchAssistent(o: ISearchAssistentOptions): Assistent[] {
        const filtered = this.assistents.filter(a => {
            if (o.area !== undefined && a.area.toLowerCase() !== o.area.toLowerCase()) return false
            if (o.level !== undefined && a.level.toLowerCase() !== o.level.toLowerCase()) return false
            return true
        })

        return this.searchPerson(filtered, o.text)
    }

    searchPerson(collection: Person[], text?: string): any[] {
        if (!text || text === '') return collection

        const containsInsensitive = (container, s) => {
            return container.toLowerCase().indexOf(s.toLowerCase()) !== -1
        }

        return collection.filter(s => {
            return [s.name, s.uc, s.github].some(field => {
                return containsInsensitive(field, text)
            })
        })
    }

    printableStudent(s): string {
        const repo = this.personGithubURLinOrganization(s);
        const text =
            `${s.name} (${s.uc})
Sec. ${s.section}
Github: ${s.githubURL}
Repo: ${repo}`;
        return text;
    }

    printableAssistent(s): string {
        const text =
            `${s.name} (${s.uc}) [${ s.level} ${s.area}]
Teléfono: ${s.phoneWithArea}
Github: ${s.githubURL}`;
        return text;
    }

    printableStudents(students: Student[]): string {
        return students.map(this.printableStudent).join('\n--------------------------\n');
    }

    printableAssistents(assistents: Assistent[]): string {
        return assistents.map(this.printableAssistent).join('\n--------------------------\n');
    }
}
