// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../lib/jx', 'react-bootstrap', '../../lib/jx'], function (require, exports, React, jx, rb, jx_1) {
    var b = rb;
    var CompDepart = (function (_super) {
        __extends(CompDepart, _super);
        function CompDepart() {
            _super.apply(this, arguments);
        }
        CompDepart.prototype.render = function () {
            var html = React.createElement("div", {"className": "col-lg-12 animated fadeInRight", "style": { padding: 0 }}, React.createElement(jx.controls.BlackBlox, {"title": "Add new department", "icon": React.createElement("i", {"className": "fa fa-plus-circle"})}, "Department data"));
            return html;
        };
        return CompDepart;
    })(jx_1.Views.ReactView);
    exports.CompDepart = CompDepart;
});
//# sourceMappingURL=C:/StampDev/SmartAdmin/SmartAdmin/js/views/company/comp_dept.js.map