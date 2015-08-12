/// <reference path="../typings/node-telegram-bot-api/TelegramBot.d.ts"/>
/// <reference path="../typings/node/node.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var path_1 = require('path');
var telegram_typed_bot_1 = require('./bot/telegram-typed-bot');
var parser_1 = require('./models/parser');
exports.t = require('./bot/telegram-bot-typings');
var AyudanteBOT = (function (_super) {
    __extends(AyudanteBOT, _super);
    function AyudanteBOT(options) {
        _super.call(this, options.tokens.telegram, options.server);
        this.github = options.github;
        this.students = parser_1.loadStudents(path_1.resolve('.', 'data', 'students.csv'));
        this.assistents = parser_1.loadAssistents(path_1.resolve('.', 'data', 'assistents.csv'));
    }
    Object.defineProperty(AyudanteBOT.prototype, "githubUrl", {
        get: function () {
            return 'https://github.com/' + this.github;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AyudanteBOT.prototype, "syllabusUrl", {
        get: function () {
            return this.githubUrl + '/syllabus';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AyudanteBOT.prototype, "privateUrl", {
        get: function () {
            return this.githubUrl + '/private';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AyudanteBOT.prototype, "starterUrl", {
        get: function () {
            return this.githubUrl + '/starter';
        },
        enumerable: true,
        configurable: true
    });
    AyudanteBOT.prototype.personGithubURLinOrganization = function (person) {
        return this.githubUrl + '/' + person.github;
    };
    AyudanteBOT.prototype.searchStudent = function (o) {
        var filtered = this.students.filter(function (a) {
            if (o.section !== undefined && a.section !== o.section)
                return false;
            if (o.quitted !== undefined && a.quitted !== o.quitted)
                return false;
            return true;
        });
        return this.searchPerson(filtered, o.text);
    };
    AyudanteBOT.prototype.searchAssistent = function (o) {
        var filtered = this.assistents.filter(function (a) {
            if (o.area !== undefined && a.area.toLowerCase() !== o.area.toLowerCase())
                return false;
            if (o.level !== undefined && a.level.toLowerCase() !== o.level.toLowerCase())
                return false;
            return true;
        });
        return this.searchPerson(filtered, o.text);
    };
    AyudanteBOT.prototype.searchPerson = function (collection, text) {
        if (!text || text === '')
            return collection;
        var containsInsensitive = function (container, s) {
            return container.toLowerCase().indexOf(s.toLowerCase()) !== -1;
        };
        return collection.filter(function (s) {
            return [s.name, s.uc, s.github].some(function (field) {
                return containsInsensitive(field, text);
            });
        });
    };
    AyudanteBOT.prototype.printableStudent = function (s) {
        var repo = this.personGithubURLinOrganization(s);
        var text = s.name + " (" + s.uc + ")\nSec. " + s.section + "\nGithub: " + s.githubURL + "\nRepo: " + repo;
        return text;
    };
    AyudanteBOT.prototype.printableAssistent = function (s) {
        var text = s.name + " (" + s.uc + ") [" + s.level + " " + s.area + "]\nTel\u00E9fono: " + s.phoneWithArea + "\nGithub: " + s.githubURL;
        return text;
    };
    AyudanteBOT.prototype.printableStudents = function (students) {
        return students.map(this.printableStudent).join('\n--------------------------\n');
    };
    AyudanteBOT.prototype.printableAssistents = function (assistents) {
        return assistents.map(this.printableAssistent).join('\n--------------------------\n');
    };
    return AyudanteBOT;
})(telegram_typed_bot_1.TelegramTypedBot);
exports.AyudanteBOT = AyudanteBOT;