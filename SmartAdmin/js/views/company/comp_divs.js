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
    var CompDivs = (function (_super) {
        __extends(CompDivs, _super);
        function CompDivs(props) {
            _super.call(this, props);
            this.state.loading = true;
        }
        CompDivs.prototype.render = function () {
            var html = React.createElement("div", {"style": { minHeight: 350 }}, React.createElement("button", {"className": "btn btn-primary btn-addnew"}, React.createElement("i", {"className": "fa fa-plus-circle", "aria-hidden": "true"}), " Add new division"), React.createElement("hr", null), React.createElement("div", {"className": "datalist", "style": { fontSize: 18 }}, React.createElement("table", {"className": "table", "style": { width: '100%' }})));
            return html;
        };
        CompDivs.prototype.componentDidMount = function () {
            this.init_actions();
            if (this.state.loading) {
                this.load_data();
            }
        };
        CompDivs.prototype.componentDidUpdate = function () {
            this.display_datatable();
        };
        CompDivs.prototype.load_data = function () {
            var _this = this;
            var model = Backendless.Persistence.of('compdivs');
            var qry = new Backendless.DataQuery();
            qry.condition = "usrid = '{0}'".format(Backendless.UserService.getCurrentUser()['objectId']);
            var d = Q.defer();
            utils.spin(this.root);
            model.find(qry, new Backendless.Async(function (res) {
                _this.data = res.data;
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
        CompDivs.prototype.display_datatable = function () {
            if (!this.state.loading) {
                if (!this.datatable) {
                    this.datatable = this.root.find('table').DataTable({
                        columns: [
                            { data: 'compdiv_title', title: 'Division title', width: '40%' },
                        ],
                        paging: false,
                        lengthChange: false,
                        info: false,
                        data: this.data
                    });
                }
            }
        };
        CompDivs.prototype.init_actions = function () {
            var _this = this;
            this.root.find('.btn-addnew').off('click');
            this.root.find('.btn-addnew').click(function () {
                _this.props.owner.notify('add-new-division');
            });
        };
        return CompDivs;
    })(jx_1.Views.ReactView);
    exports.CompDivs = CompDivs;
    var CompDivsEdit = (function (_super) {
        __extends(CompDivsEdit, _super);
        function CompDivsEdit(props) {
            _super.call(this, props);
        }
        CompDivsEdit.prototype.render = function () {
            var mode = 'Edit new division';
            if (this.props.mode === 'new') {
                mode = 'Add new division';
            }
            var html = React.createElement("div", {"className": "animated fadeInRight"}, React.createElement(jx.controls.BlackBlox, {"title": mode, "icon": React.createElement("i", {"className": "fa fa-edit"})}, React.createElement(b.FormGroup, {"controlId": "formControlsText"}, React.createElement(jx.controls.BigLabel, {"label": "Division title"}), React.createElement(b.FormControl, {"type": "text", "id": "compdiv_title", "placeholder": "Enter a title"})), React.createElement(b.FormGroup, {"controlId": "formControlsText"}, React.createElement(jx.controls.BigLabel, {"label": "Division description"}), React.createElement("textarea", {"rows": 3, "id": "compdiv_descr", "className": "custom-scroll form-control"})), React.createElement("br", null), React.createElement("button", {"className": "btn btn-danger pull-right", "style": { marginLeft: 10 }}, React.createElement("i", {"className": "fa fa-times"}), " Cancel"), React.createElement("button", {"className": "btn btn-info pull-right btn-save"}, React.createElement("i", {"className": "fa fa-check"}), " Save"), React.createElement("br", null)));
            return html;
        };
        CompDivsEdit.prototype.componentDidMount = function () {
            var _this = this;
            this.root.find('.btn-save').click(function () {
                if (_this.props.mode === 'new') {
                    var model = Backendless.Persistence.of('compdivs');
                    var obj = new CompDiv();
                    obj['usrid'] = Backendless.UserService.getCurrentUser()['objectId'];
                    obj['compdiv_title'] = _this.root.find('#compdiv_title').val();
                    obj['compdiv_descr'] = _this.root.find('#compdiv_descr').val();
                    utils.spin(_this.root);
                    model.save(obj, new Backendless.Async(function (res) {
                        toastr.success('Data saved successfully');
                        utils.unspin(_this.root);
                    }, function (err) {
                        utils.unspin(_this.root);
                        toastr.error(err['message']);
                    }));
                }
            });
        };
        return CompDivsEdit;
    })(jx_1.Views.ReactView);
    exports.CompDivsEdit = CompDivsEdit;
    var CompDiv = (function () {
        function CompDiv() {
        }
        return CompDiv;
    })();
});
//# sourceMappingURL=C:/StampDev/SmartAdmin/SmartAdmin/js/views/company/comp_divs.js.map