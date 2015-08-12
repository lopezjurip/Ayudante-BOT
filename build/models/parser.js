/// <reference path="../../typings/babyparse/babyparse.d.ts"/>
/// <reference path="../../typings/node/node.d.ts"/>
var Baby = require('babyparse');
var models_1 = require('./models');
var fs = require('fs');
function readFile(path) {
    return fs.readFileSync(path, 'utf8');
}
function readCSV(path) {
    var parsed = Baby.parse(readFile(path), {
        delimiter: ',',
        header: true,
        skipEmptyLines: true,
    });
    return parsed.data;
}
function loadStudents(path) {
    return readCSV(path).map(function (row) {
        return new models_1.Student({
            name: row.Names + ' ' + row.Father + ' ' + row.Mother,
            number: row.Number,
            section: row.Section,
            uc: row.UC,
            github: row.Github,
            quitted: row.Quitted,
        });
    });
}
exports.loadStudents = loadStudents;
function loadAssistents(path) {
    return readCSV(path).map(function (row) {
        return new models_1.Assistent({
            name: row.Name,
            area: row.Area,
            level: row.Level,
            uc: row.UC,
            github: row.Github,
            phone: row.Phone,
        });
    });
}
exports.loadAssistents = loadAssistents;
