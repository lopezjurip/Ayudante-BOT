var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Person = (function () {
    function Person(args) {
        this.name = args.name;
        this.uc = args.uc;
        this.github = args.github;
    }
    Object.defineProperty(Person.prototype, "email", {
        get: function () {
            return this.uc + '@uc.cl';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "githubURL", {
        get: function () {
            return 'https://github.com/' + this.github;
        },
        enumerable: true,
        configurable: true
    });
    return Person;
})();
exports.Person = Person;
var Student = (function (_super) {
    __extends(Student, _super);
    function Student(args) {
        _super.call(this, args);
        this.quitted = args.quitted === '1';
        this.section = parseInt(args.section);
        this.number = args.number;
    }
    return Student;
})(Person);
exports.Student = Student;
var Assistent = (function (_super) {
    __extends(Assistent, _super);
    function Assistent(args) {
        _super.call(this, args);
        this.area = args.area;
        this.level = args.level;
        this.phone = args.phone;
        this.telegram = args.telegram;
    }
    Object.defineProperty(Assistent.prototype, "phoneWithArea", {
        get: function () {
            return '+569' + this.phone;
        },
        enumerable: true,
        configurable: true
    });
    return Assistent;
})(Person);
exports.Assistent = Assistent;
