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
        var props = {
            page_navmenu: '.navbar',
            page_content: '.page-content',
        };
        return React.createElement(Page, React.__spread({}, props));
    }
    exports.fn = fn;
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page() {
            _super.apply(this, arguments);
        }
        Page.prototype.get_internal_routes = function () {
            return {
                'testview': {
                    url: 'home/testview'
                }
            };
        };
        return Page;
    })(jx_1.Views.ReactView);
});
//# sourceMappingURL=F:/StampDev/SmartAdmin/SmartAdmin/js/views/home/page404.js.map