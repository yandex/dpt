'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProgressBar = function () {
    function ProgressBar() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        _classCallCheck(this, ProgressBar);

        this.value = value;
        this.dom = document.createElement('div');

        Object.assign(this.dom.style, {
            position: 'absolute',
            left: 0,
            top: 0,
            height: '3px',
            backgroundColor: '#ccc',
            transition: 'width 0.2s'
        });

        document.body.appendChild(this.dom);
        this.dom.style.visibility = 'visible';
        this.render();
    }

    _createClass(ProgressBar, [{
        key: 'render',
        value: function render() {
            this.dom.style.width = this.value * 100 + '%';
        }
    }, {
        key: 'setValue',
        value: function setValue(value) {
            this.value = value;
            this.render();
        }
    }, {
        key: 'increment',
        value: function increment() {
            var remaining = 1 - this.value;
            this.setValue(this.value + remaining * 0.1);
        }
    }, {
        key: 'complete',
        value: function complete(cb) {
            var _this = this;

            this.dom.style.transition = 'width 0.01s';
            this.setValue(1);
            setTimeout(function () {
                _this.dom.remove();
                cb();
            }, 30);
        }
    }]);

    return ProgressBar;
}();

exports.default = ProgressBar;
module.exports = exports['default'];