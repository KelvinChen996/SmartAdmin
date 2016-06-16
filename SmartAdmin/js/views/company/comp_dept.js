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
        function CompDepart(props) {
            _super.call(this, props);
            this.state.loading = true;
            this.state.id = this.props.dept_id;
        }
        CompDepart.prototype.render = function () {
            var that = this;
            var title = 'Add new department';
            var icon = React.createElement("i", {"className": "fa fa-plus-circle"});
            if (!this.isNew) {
                title = 'Edit department';
                icon = React.createElement("i", {"className": "fa fa-edit"});
            }
            var html = React.createElement("div", {"className": "col-lg-12 animated fadeInRight", "style": { padding: 0 }}, React.createElement("br", null), React.createElement(jx.controls.BlackBlox, {"title": title, "icon": icon}, React.createElement("form", null, React.createElement(b.FormGroup, {"controlId": "formControlsText"}, React.createElement(jx.controls.BigLabel, {"label": "Department title"}), React.createElement(b.FormControl, {"type": "text", "data-bind": "textInput:compdept_title", "placeholder": "Enter a title"})), React.createElement(b.FormGroup, {"controlId": "formControlsText"}, React.createElement(jx.controls.BigLabel, {"label": "Department description"}), React.createElement("textarea", {"rows": 3, "id": "compdept_descr", "data-bind": "textInput:compdept_descr", "className": "custom-scroll form-control"})), React.createElement("br", null), React.createElement("button", {"type": "button", "className": "btn btn-danger pull-right btn-cancel", "onClick": function () { that.cancel(); }, "style": { marginLeft: 10 }}, React.createElement("i", {"className": "fa fa-times"}), " Cancel"), React.createElement("button", {"type": "button", "className": "btn btn-primary pull-right btn-save", "onClick": function () { that.save(); }}, React.createElement("i", {"className": "fa fa-check"}), " Save"), React.createElement("br", null))));
            return html;
        };
        Object.defineProperty(CompDepart.prototype, "isNew", {
            get: function () {
                return !this.state.id;
            },
            enumerable: true,
            configurable: true
        });
        CompDepart.prototype.componentDidMount = function () {
            if (this.state.loading) {
                this.load_data();
            }
        };
        CompDepart.prototype.componentDidUpdate = function () {
            ko.cleanNode(this.root[0]);
            ko.applyBindings(this.item, this.root[0]);
        };
        CompDepart.prototype.load_data = function () {
            var _this = this;
            utils.spin(this.root);
            var model = Backendless.Persistence.of('compdivs');
            var qry = new Backendless.DataQuery();
            qry.condition = "objectId = '{0}'".format(this.props.div_id);
            qry.options = { relations: ["depts"] };
            var that = this;
            var d = Q.defer();
            model.find(qry, new Backendless.Async(function (res) {
                _this.div_obj = res.data[0];
                if (!_this.isNew) {
                    var dept = _.find(res.data[0].depts, function (dep) {
                        return dep['objectId'] === _this.props.dept_id;
                    });
                    that.item = ko['mapping'].fromJS(dept);
                }
                else {
                    var obj = _.extend(new CompDept(), {
                        ___class: 'compdept',
                        compdivs_id: _this.div_obj['objectId'],
                        compdept_title: '',
                        compdept_descr: ''
                    });
                    _this.item = ko['mapping'].fromJS(obj);
                }
                utils.unspin(_this.root);
                _this.setState({
                    loading: false
                });
                d.resolve(that.item);
            }));
            return d.promise;
        };
        CompDepart.prototype.save = function () {
            var _this = this;
            if (this.isNew) {
                this.add_new_div().then(function () {
                    _this.setState({
                        loading: true
                    });
                });
            }
            else {
                this.save_div();
            }
        };
        CompDepart.prototype.save_div = function () {
            var _this = this;
            var obj = ko['mapping'].toJS(this.item);
            utils.spin(this.root);
            var model = Backendless.Persistence.of('compdept');
            model.save(obj, new Backendless.Async(function (res) {
                toastr.success('Data saved successfully');
                utils.unspin(_this.root);
                //this.props.owner.notify('update_list');
            }, function (err) {
                utils.unspin(_this.root);
                toastr.error(err['message']);
            }));
        };
        CompDepart.prototype.add_new_div = function () {
            var _this = this;
            var model = Backendless.Persistence.of('compdivs');
            var obj = ko['mapping'].toJS(this.item);
            obj['compdept_title'] = this.root.find('[data-bind="textInput:compdept_title"]').val();
            obj['compdept_descr'] = this.root.find('[data-bind="textInput:compdept_descr"]').val();
            this.div_obj['depts'].push(obj);
            var d = Q.defer();
            utils.spin(this.root);
            model.save(this.div_obj, new Backendless.Async(function (res) {
                toastr.success('Data saved successfully');
                _this.state.id = res['objectId'];
                utils.unspin(_this.root);
                d.resolve(true);
            }, function (err) {
                utils.unspin(_this.root);
                toastr.error(err['message']);
                d.reject(false);
            }));
            return d.promise;
        };
        CompDepart.prototype.cancel = function () {
            this.setState({
                loading: true
            });
        };
        return CompDepart;
    })(jx_1.Views.ReactView);
    exports.CompDepart = CompDepart;
    var CompDept = (function () {
        function CompDept() {
        }
        return CompDept;
    })();
});
//# sourceMappingURL=C:/StampDev/SmartAdmin/SmartAdmin/js/views/company/comp_dept.js.map