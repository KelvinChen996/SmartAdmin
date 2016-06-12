/// <reference path="comp_divs.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../lib/jx', './comp_divs', '../../lib/jx'], function (require, exports, React, jx, divs, jx_1) {
    var CompOrg = (function (_super) {
        __extends(CompOrg, _super);
        function CompOrg() {
            _super.apply(this, arguments);
        }
        CompOrg.prototype.render = function () {
            var html = React.createElement("div", {"className": "col-lg-12"}, React.createElement(jx.controls.BigLabel, {"label": "Company divisions"}), React.createElement("br", null), React.createElement("div", {"className": "col-lg-4", "style": { paddingLeft: 0 }}, React.createElement(jx.controls.BlackBlox, {"title": "Divisions", "icon": React.createElement("i", {"className": "fa fa-cubes"})}, React.createElement("br", null), React.createElement(divs.CompDivs, {"owner": this}))), React.createElement("div", {"className": "col-lg-5"}, this.display_editForm()));
            return html;
        };
        CompOrg.prototype.componentDidMount = function () {
            this.state.addNew = false;
        };
        CompOrg.prototype.notify = function (cmd, data) {
            switch (cmd) {
                case 'add-new-division':
                    {
                        this.setState({
                            addNew: true
                        });
                    }
                    break;
            }
            return Q.resolve(true);
        };
        CompOrg.prototype.display_editForm = function () {
            if (this.state.addNew) {
                return React.createElement(divs.CompDivsEdit, {"mode": "new"});
            }
        };
        return CompOrg;
    })(jx_1.Views.ReactView);
    exports.CompOrg = CompOrg;
});
//# sourceMappingURL=C:/StampDev/SmartAdmin/SmartAdmin/js/views/company/comp_org.js.map