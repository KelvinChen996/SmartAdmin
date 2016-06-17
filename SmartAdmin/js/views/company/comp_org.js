/// <reference path="comp_divs.tsx" />
/// <reference path="comp_dept.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', '../../lib/jx', './comp_divs', './comp_dept', '../../lib/jx'], function (require, exports, React, ReactDOM, jx, divs, deps, jx_1) {
    "use strict";
    (function (EntryMode) {
        EntryMode[EntryMode["none"] = 0] = "none";
        EntryMode[EntryMode["add_div"] = 1] = "add_div";
        EntryMode[EntryMode["edit_div"] = 2] = "edit_div";
        EntryMode[EntryMode["add_dep"] = 3] = "add_dep";
        EntryMode[EntryMode["edit_dep"] = 4] = "edit_dep";
    })(exports.EntryMode || (exports.EntryMode = {}));
    var EntryMode = exports.EntryMode;
    var CompOrg = (function (_super) {
        __extends(CompOrg, _super);
        function CompOrg() {
            _super.apply(this, arguments);
        }
        CompOrg.prototype.render = function () {
            var html = React.createElement("div", {className: "col-lg-12"}, React.createElement(jx.controls.BigLabel, {label: "Company divisions"}), React.createElement("br", null), React.createElement("div", {className: "col-lg-6", style: { paddingLeft: 0 }}, React.createElement(jx.controls.BoxPanel, {box_color: "blueLight", title: "Divisions", icon: React.createElement("i", {className: "fa fa-cubes"})}, React.createElement("br", null), React.createElement(divs.CompDivsTreeView, {ref: "divs_comp", ext_ids: this.state.sel_ids, owner: this}))), React.createElement("div", {className: "col-lg-6"}, React.createElement("div", {className: "col-lg-12 edit-div", style: { padding: 0 }}, this.display_DivEntrView()), React.createElement("div", {className: "edit-dep", style: { padding: 0 }}, this.display_DepartmentEntryView())));
            return html;
        };
        CompOrg.prototype.notify = function (cmd, data) {
            ReactDOM.unmountComponentAtNode(this.root.find('.edit-dep')[0]);
            switch (cmd) {
                case 'add-new-division':
                    {
                        this.setState({
                            entrymode: EntryMode.add_div
                        });
                    }
                    break;
                case 'edit-division':
                    {
                        var expnd_list = [];
                        _.each(this.root.find('.dd-item.division'), function (el) {
                            if (!$(el).hasClass('dd-collapsed')) {
                                expnd_list.push(el);
                            }
                        });
                        var selected_ids = _.map(expnd_list, function (el) {
                            return $(el).attr('data-id');
                        });
                        this.setState({
                            entrymode: EntryMode.edit_div,
                            div_id: data,
                            sel_ids: selected_ids
                        });
                    }
                    break;
                case 'update_list':
                    {
                        this.refs["divs_comp"].update();
                    }
                    break;
                case 'add_depart':
                    {
                        this.setState({
                            entrymode: EntryMode.add_dep,
                            div_id: data,
                            sel_ids: selected_ids
                        });
                    }
                    break;
                case 'edit-department':
                    {
                        this.setState({
                            entrymode: EntryMode.edit_dep,
                            div_id: data,
                            sel_ids: selected_ids
                        });
                    }
                    break;
            }
            return Q.resolve(true);
        };
        CompOrg.prototype.display_DivEntrView = function () {
            var props = {
                key: utils.guid(),
                owner: this
            };
            switch (this.state.entrymode) {
                case EntryMode.add_div:
                    {
                        props.mode = 'new';
                    }
                    break;
                case EntryMode.edit_div:
                    {
                        props.mode = 'edit';
                        props.id = this.state.div_id;
                    }
                    break;
            }
            if (props.mode) {
                return React.createElement(divs.CompDivsEdit, React.__spread({}, props));
            }
        };
        CompOrg.prototype.display_DepartmentEntryView = function () {
            var props = {
                div_id: null,
                dept_id: null,
            };
            switch (this.state.entrymode) {
                case EntryMode.edit_dep:
                case EntryMode.add_dep: {
                    return React.createElement(deps.CompDepartment, React.__spread({}, props));
                }
            }
        };
        return CompOrg;
    }(jx_1.Views.ReactView));
    exports.CompOrg = CompOrg;
});
//# sourceMappingURL=F:/StampDev/SmartAdmin/SmartAdmin/js/views/company/comp_org.js.map