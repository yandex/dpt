'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DepotPlatform = function () {
    function DepotPlatform() {
        _classCallCheck(this, DepotPlatform);

        var qs = _qs2.default.parse(window.location.search.substr(1));
        var pathname = window.location.pathname;
        var pathParts = pathname.split('/');
        var filenameParts = pathParts[pathParts.length - 1].split('.');

        var qsPlatform = qs.platform || qs.p;
        var fnPlatform = void 0;

        if (/\.html$/.test(pathname) && filenameParts.length > 2 && filenameParts[1] !== 'bml') {
            fnPlatform = filenameParts[1];
        }

        // Detect platform from userAgent
        var uaPlatform = void 0;
        var userAgent = window.navigator.userAgent;
        if (/iPhone/.test(userAgent)) {
            uaPlatform = 'mobile';
        } else if (/iPad/.test(userAgent)) {
            uaPlatform = 'tablet';
        } else if (/Android/.test(userAgent) || window.screen.availWidth <= 1024) {
            var minRez = Math.min(window.screen.availHeight, window.screen.availWidth);
            if (minRez < 768) {
                uaPlatform = 'mobile';
            } else {
                uaPlatform = 'tablet';
            }
        }

        this.platform = qsPlatform || fnPlatform || uaPlatform || 'desktop';
    }

    _createClass(DepotPlatform, [{
        key: 'is',
        value: function is(platform) {
            return this.platform === platform || this.platform === platform + '-experimental';
        }
    }, {
        key: 'isDesktop',
        value: function isDesktop() {
            return this.is('desktop');
        }
    }, {
        key: 'isMobile',
        value: function isMobile() {
            return this.is('mobile');
        }
    }, {
        key: 'isTablet',
        value: function isTablet() {
            return this.is('tablet');
        }
    }, {
        key: 'isExperimental',
        value: function isExperimental() {
            return (/-experimental$/.test(this.platform)
            );
        }
    }]);

    return DepotPlatform;
}();

exports.default = DepotPlatform;
module.exports = exports['default'];