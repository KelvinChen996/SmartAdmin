// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../lib/jx', 'react-bootstrap', '../../lib/jx'], function (require, exports, React, jx, rb, jx_1) {
    "use strict";
    var b = rb;
    var CompDivs = (function (_super) {
        __extends(CompDivs, _super);
        function CompDivs(props) {
            _super.call(this, props);
            this.divs_data = [];
            this.depts_data = [];
            this.state.loading = true;
        }
        CompDivs.prototype.render = function () {
            var html = React.createElement("div", {style: { minHeight: 350 }}, React.createElement("button", {className: "btn btn-primary btn-addnew"}, React.createElement("i", {className: "fa fa-plus-circle", "aria-hidden": "true"}), " Add new division"), React.createElement("hr", null), React.createElement("div", {className: "tree-view"}, React.createElement("div", {className: "dd"}, React.createElement("ol", {className: "dd-list"}, this.build_treelist()))));
            return html;
        };
        CompDivs.prototype.componentDidMount = function () {
            this.init_actions();
            if (this.state.loading) {
                this.load_divs_data();
            }
        };
        CompDivs.prototype.componentDidUpdate = function () {
            if (this.state.loading) {
                this.load_divs_data();
            }
            else {
                this.init_view();
            }
        };
        CompDivs.prototype.init_view = function () {
            var _this = this;
            if (this.divs_data.length > 0) {
                this['nestable'] = this.root.find('.tree-view > .dd')['nestable']().nestable('collapseAll');
            }
            this.root.find('.dd-item .href-div-title').click(function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var id = $(e.currentTarget).closest('.dd-item').attr('data-id');
                _this.highlight_selection(id);
                _this.edit_division(id);
            });
            this.root.find('.btn-edit-dept').off('click');
            this.root.find('.btn-edit-dept').click(function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var dept_id = $(e.currentTarget).closest('.department').attr('data-id');
                var div_id = $(e.currentTarget).closest('.division').attr('data-id');
                _this.edit_department(div_id, dept_id);
            });
            if (this.selected_id) {
                this.highlight_selection(this.selected_id);
                this.selected_id = null;
            }
        };
        CompDivs.prototype.update = function () {
            this.selected_id = this.root.find('.selected').closest('.dd-item').attr('data-id');
            this.setState({
                loading: true
            });
        };
        CompDivs.prototype.highlight_selection = function (id) {
            this.root.find('.selected').removeClass('selected');
            this.root.find('.icon-select').addClass('hidden');
            var li = this.root.find('[data-id="{0}"]'.format(id));
            li.find('.dd-handle').first().addClass('selected');
            li.find('.icon-select').removeClass('hidden');
            //if (!$(li).hasClass('dd-collapsed')) {
            //    var plugin = this.root.find('.tree-view > .dd').data('nestable');
            //    plugin.expandItem(li);
            //}        
        };
        CompDivs.prototype.edit_division = function (id) {
            this.props.owner.notify('edit-division', id);
        };
        CompDivs.prototype.edit_department = function (div_id, dept_id) {
            this.props.owner.notify('edit-department', {
                div_id: div_id,
                dept_id: dept_id
            });
        };
        CompDivs.prototype.load_divs_data = function () {
            var _this = this;
            var model = Backendless.Persistence.of('compdivs');
            var qry = new Backendless.DataQuery();
            qry.condition = "usrid = '{0}'".format(Backendless.UserService.getCurrentUser()['objectId']);
            qry.options = { relations: ["depts"] };
            var d = Q.defer();
            utils.spin(this.root);
            model.find(qry, new Backendless.Async(function (res) {
                _this.divs_data = res.data;
                utils.unspin(_this.root);
                _this.setState({
                    loading: false
                });
                d.resolve(true);
            }, function (err) {
                utils.unspin(_this.root);
                _this.setState({
                    loading: false
                });
                d.reject(false);
            }));
            return d.promise;
        };
        CompDivs.prototype.build_treelist = function () {
            var _this = this;
            var count = 1;
            var nodes = _.map(this.divs_data, function (d) {
                var item = React.createElement("li", {className: "dd-item division", "data-id": d['objectId'], style: { cursor: 'pointer', }}, React.createElement("div", {className: "dd-handle dd-nodrag"}, React.createElement("div", {className: "content"}, React.createElement("h4", {className: "text-primary"}, React.createElement("span", {className: "semi-bold"}, React.createElement("a", {href: "#", className: "href-div-title", style: { fontSize: 23 }}, d['compdiv_title']))), React.createElement("span", {className: "text-muted"}, React.createElement("small", null, d['compdiv_descr'])))), _this.load_departments(d));
                return item;
            });
            return nodes;
        };
        CompDivs.prototype.load_departments = function (div) {
            var depts = div['depts'];
            //if (!depts || depts.length === 0) {
            //    return;
            //}
            var html = React.createElement("ol", {className: "dd-list"}, React.createElement("li", {className: "dd-item department dd-nodrag", "data-id": utils.guid()}, React.createElement("div", {className: "dd-handle dd-nodrag"}, React.createElement("div", {className: "content-department"}, React.createElement("span", {className: "text-info"}, React.createElement("strong", null, "Departments")), React.createElement("span", {className: "pull-right"}, React.createElement("a", {href: "#", className: "btn btn-info btn-xs btn-edit-dept"}, React.createElement("i", {className: "fa fa-plus"}, " ", "add new")))))), _.map(depts, function (dep) {
                var li = React.createElement("li", {className: "dd-item department dd-nodrag", "data-id": dep['objectId']}, React.createElement("div", {className: "dd-handle dd-nodrag"}, React.createElement("div", {className: "content-department"}, React.createElement("h4", {className: "text-primary", style: { fontSize: 23 }}, React.createElement("span", {className: "semi-bold"}, dep['compdept_title'])), React.createElement("span", {className: "text-muted"}, dep['compdept_descr']), React.createElement("span", {className: "pull-right hidden"}, React.createElement("a", {href: "#", className: "text-primary btn-edit-dept"}, React.createElement("i", {className: "fa fa-pencil"}), " edit")))));
                return li;
            }));
            return html;
        };
        CompDivs.prototype.init_actions = function () {
            var _this = this;
            this.root.find('.btn-addnew').off('click');
            this.root.find('.btn-addnew').click(function () {
                _this.props.owner.notify('add-new-division');
            });
        };
        return CompDivs;
    }(jx_1.Views.ReactView));
    exports.CompDivs = CompDivs;
    var CompDivsEdit = (function (_super) {
        __extends(CompDivsEdit, _super);
        function CompDivsEdit(props) {
            _super.call(this, props);
            this.state.loading = true;
        }
        CompDivsEdit.prototype.render = function () {
            var _this = this;
            var mode = 'Edit division';
            if (this.props.mode === 'new') {
                mode = 'Add new division';
            }
            var html = React.createElement("form", {className: "animated fadeInRight"}, React.createElement(jx.controls.BlackBlox, {title: mode, icon: React.createElement("i", {className: "fa fa-edit"})}, React.createElement(b.FormGroup, {controlId: "formControlsText"}, React.createElement(jx.controls.BigLabel, {className: "edit-mode", label: "Division title"}), React.createElement(b.FormControl, {type: "text", "data-bind": "textInput:compdiv_title", className: "edit-mode", id: "compdiv_title", placeholder: "Enter a title"}), React.createElement("p", {"data-bind": "text:compdiv_title", className: "view-mode hidden", style: { marginTop: 10, fontSize: 32, fontWeight: 100 }}), React.createElement("p", {"data-bind": "text:compdiv_descr", className: "view-mode text-muted hidden", style: { marginTop: 10, fontSize: 32, fontWeight: 100 }})), React.createElement("div", {className: "edit-mode"}, React.createElement(b.FormGroup, {controlId: "formControlsText"}, React.createElement(jx.controls.BigLabel, {label: "Division description"}), React.createElement("textarea", {rows: 3, id: "compdiv_descr", "data-bind": "textInput:compdiv_descr", className: "custom-scroll form-control"})), React.createElement("br", null), React.createElement("button", {type: "button", className: "btn btn-info btn-add-dep", onClick: function () { _this.add_dept(); }, style: { marginLeft: 10 }}, React.createElement("i", {className: "fa fa-plus"}), " ", "Add department"), React.createElement("button", {type: "button", className: "btn btn-danger pull-right btn-cancel", onClick: function () { _this.cancel(); }, style: { marginLeft: 10 }}, React.createElement("i", {className: "fa fa-times"}), " Cancel"), React.createElement("button", {type: "button", className: "btn btn-primary pull-right btn-save", onClick: function () { _this.save(); }}, React.createElement("i", {className: "fa fa-check"}), " Save"), React.createElement("br", null))));
            return html;
        };
        CompDivsEdit.prototype.componentDidMount = function () {
            if (!this.props.id) {
                this.root.find('.btn-add-dep').addClass('hidden');
            }
            if (this.state.loading) {
                this.load_data();
            }
        };
        CompDivsEdit.prototype.save = function () {
            if (this.props.mode === 'new') {
                this.add_new_div();
            }
            else {
                this.save_div();
            }
        };
        CompDivsEdit.prototype.cancel = function () {
            this.setState({
                loading: true
            });
        };
        CompDivsEdit.prototype.add_dept = function () {
            this.props.owner.notify('add_depart');
        };
        CompDivsEdit.prototype.componentDidUpdate = function () {
            if (this.state.loading) {
                this.load_data();
            }
            else {
                if (this.props.id) {
                    ko.cleanNode(this.root[0]);
                    ko.applyBindings(this.item, this.root[0]);
                }
            }
        };
        CompDivsEdit.prototype.save_div = function () {
            var _this = this;
            var obj = ko['mapping'].toJS(this.item);
            utils.spin(this.root);
            var model = Backendless.Persistence.of('compdivs');
            model.save(obj, new Backendless.Async(function (res) {
                toastr.success('Data saved successfully');
                utils.unspin(_this.root);
                _this.props.owner.notify('update_list');
            }, function (err) {
                utils.unspin(_this.root);
                toastr.error(err['message']);
            }));
        };
        CompDivsEdit.prototype.add_new_div = function () {
            var _this = this;
            var model = Backendless.Persistence.of('compdivs');
            var obj = new CompDiv();
            obj['usrid'] = Backendless.UserService.getCurrentUser()['objectId'];
            obj['compdiv_title'] = this.root.find('#compdiv_title').val();
            obj['compdiv_descr'] = this.root.find('#compdiv_descr').val();
            utils.spin(this.root);
            model.save(obj, new Backendless.Async(function (res) {
                toastr.success('Data saved successfully');
                utils.unspin(_this.root);
            }, function (err) {
                utils.unspin(_this.root);
                toastr.error(err['message']);
            }));
        };
        CompDivsEdit.prototype.load_data = function () {
            var _this = this;
            var model = Backendless.Persistence.of('compdivs');
            var qry = new Backendless.DataQuery();
            qry.condition = "objectId = '{0}'".format(this.props.id);
            var d = Q.defer();
            utils.spin(this.root);
            var that = this;
            model.find(qry, new Backendless.Async(function (res) {
                that.item = ko['mapping'].fromJS(res.data[0]);
                utils.unspin(_this.root);
                _this.setState({
                    loading: false
                });
                d.resolve(true);
            }, function (err) {
                utils.unspin(_this.root);
                _this.setState({
                    loading: false
                });
                d.reject(false);
            }));
            return d.promise;
        };
        return CompDivsEdit;
    }(jx_1.Views.ReactView));
    exports.CompDivsEdit = CompDivsEdit;
    var CompDiv = (function () {
        function CompDiv() {
        }
        return CompDiv;
    }());
});
//# sourceMappingURL=F:/StampDev/SmartAdmin/SmartAdmin/js/views/company/comp_divs.js.map