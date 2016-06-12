/// <reference path="../../lib/jx.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../lib/jx'], function (require, exports, React, jx_1) {
    function fn() {
        return React.createElement(TestView, null);
    }
    exports.fn = fn;
    var TestView = (function (_super) {
        __extends(TestView, _super);
        function TestView() {
            _super.apply(this, arguments);
        }
        TestView.prototype.render = function () {
            return React.createElement("div", null, "Test view");
        };
        return TestView;
    })(jx_1.Views.ReactView);
});
//# sourceMappingURL=C:/StampDev/SmartAdmin/SmartAdmin/js/views/home/testview.js.map