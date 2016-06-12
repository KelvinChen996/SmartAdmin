/// <reference path="../../lib/jx.tsx" />
/// <reference path="comp_org.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', './comp_org', '../../lib/jx'], function (require, exports, React, ReactDOM, org, jx_1) {
    function fn() {
        var props = {
            page_navmenu: '.navbar',
            page_content: '.page-content',
        };
        return React.createElement(Explorer, React.__spread({}, props));
    }
    exports.fn = fn;
    var Explorer = (function (_super) {
        __extends(Explorer, _super);
        function Explorer() {
            _super.apply(this, arguments);
        }
        Explorer.prototype.get_internal_routes = function () {
            return {};
        };
        Explorer.prototype.init_page = function () {
            _super.prototype.init_page.call(this);
            $('html').attr('id', '');
            $('.login').addClass('hidden');
            $('.sign-up').addClass('hidden');
            $('.main').removeClass('hidden');
        };
        Explorer.prototype.resolve_subview = function () {
            _super.prototype.resolve_subview.call(this);
            if (this.app.router.params) {
                var subview = this.app.router.params.subview;
                if (!this.subroute_exists(subview)) {
                    switch (this.app.router.ctx.path) {
                        case '/org':
                            ReactDOM.render(React.createElement(org.CompOrg, null), this.page_content[0]);
                            break;
                        default:
                            this.load_subview('home/underconstruction');
                            break;
                    }
                }
            }
            this.highlight_active_menu();
        };
        Explorer.prototype.highlight_active_menu = function () {
            //$('#side-menu > li').removeClass('active');
            //$('#side-menu > li').removeClass('open');
            var a = $('[href="{0}"]'.format(this.app.router.ctx.path));
            $(a)['jarvismenu']('activate');
        };
        Explorer.prototype.activate_menu = function (a) {
        };
        Explorer.prototype.subroute_exists = function (subroute) {
            var routes = this.get_internal_routes();
            var key = _.find(Object.keys(routes), function (k) {
                return k === subroute;
            });
            if (!key) {
                return false;
            }
            return true;
        };
        return Explorer;
    })(jx_1.Views.MasterPage);
});
//# sourceMappingURL=C:/StampDev/SmartAdmin/SmartAdmin/js/views/company/explorer.js.map