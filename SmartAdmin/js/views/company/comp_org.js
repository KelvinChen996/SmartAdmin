// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../lib/jx'], function (require, exports, React, jx_1) {
    var CompOrg = (function (_super) {
        __extends(CompOrg, _super);
        function CompOrg() {
            _super.apply(this, arguments);
        }
        CompOrg.prototype.render = function () {
            return React.createElement("div", null, "Company org");
        };
        return CompOrg;
    })(jx_1.Views.ReactView);
    exports.CompOrg = CompOrg;
});
//# sourceMappingURL=C:/StampDev/SmartAdmin/SmartAdmin/js/views/company/comp_org.js.map