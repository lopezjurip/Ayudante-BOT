var repository_1 = require("./repository");
var Octokat = require('octokat');
var GitManager = (function () {
    function GitManager(token) {
        this.octo = new Octokat({ token: token });
    }
    GitManager.prototype.repo = function (owner, name) {
        return new repository_1.default(this.octo.repos(owner, name), owner, name);
    };
    return GitManager;
})();
exports.GitManager = GitManager;
