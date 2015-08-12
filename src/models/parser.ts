/// <reference path="../../typings/babyparse/babyparse.d.ts"/>
/// <reference path="../../typings/node/node.d.ts"/>

import * as Baby from 'babyparse';
import {Student, Assistent} from './models';
import fs = require('fs')

function readFile(path: string): string {
    return fs.readFileSync(path, 'utf8')
}

function readCSV(path: string): any[] {
    const parsed = Baby.parse(readFile(path), {
        // dynamicTyping: true,
        delimiter: ',',
        header: true,
        skipEmptyLines: true,
    });

    return parsed.data;
}

export function loadStudents(path: string): Student[] {
    return readCSV(path).map(row => {
        return new Student({
            name: row.Names + ' ' + row.Father + ' ' + row.Mother,
            number: row.Number,
            section: row.Section,
            uc: row.UC,
            github: row.Github,
            quitted: row.Quitted,
        });
    });
}

export function loadAssistents(path: string): Assistent[] {
    return readCSV(path).map(row => {
        return new Assistent({
            name: row.Name,
            area: row.Area,
            level: row.Level,
            uc: row.UC,
            github: row.Github,
            phone: row.Phone,
        });
    });
}
