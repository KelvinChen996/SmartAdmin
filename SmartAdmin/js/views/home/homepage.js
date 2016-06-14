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
        var props = {
            page_navmenu: '.navbar',
            page_content: '.page-content',
        };
        return React.createElement(HomePage, React.__spread({}, props));
    }
    exports.fn = fn;
    var HomePage = (function (_super) {
        __extends(HomePage, _super);
        function HomePage() {
            _super.apply(this, arguments);
        }
        HomePage.prototype.get_internal_routes = function () {
            return {
                'testview': {
                    url: 'home/testview'
                }
            };
        };
        HomePage.prototype.init_page = function () {
            _super.prototype.init_page.call(this);
            $('html').attr('id', 'extr-page');
            $('.login').addClass('hidden');
            $('.sign-up').addClass('hidden');
            var subview = this.app.router.params.subview;
            var path = this.app.router['ctx'].path;
            switch (path) {
                case '/signup':
                case '/login':
                    {
                        var route = _.find(Object.keys(this.app.router.routes), function (key) {
                            return key === path;
                        });
                        if (route) {
                            route = this.app.router.routes[route];
                            if (route['options']) {
                                subview = route['options']['subview'];
                            }
                        }
                    }
                    break;
            }
            switch (subview) {
                case 'signup':
                    {
                        $('.sign-up').removeClass('hidden');
                    }
                    break;
                case 'login':
                default:
                    $('.login').removeClass('hidden');
                    break;
            }
            this.init_login_actions();
            this.init_signup_actions();
        };
        HomePage.prototype.init_signup_actions = function () {
            var _this = this;
            $('.btn-signup').off('click');
            $('.btn-signup').click(function () {
                utils.spin($('#smart-form-register'));
                var email = $('#signup-email').val();
                var password = $('#signup-password').val();
                var usr = new Backendless.User();
                usr.email = email;
                usr.password = password;
                usr.username = email;
                Backendless.UserService.register(usr, new Backendless.Async(function (res) {
                    utils.unspin($('#smart-form-register'));
                    toastr.success('Registration was successfull');
                    _this.app.router.navigate('/account');
                }, function (err) {
                    utils.unspin($('#smart-form-register'));
                    toastr.error(err['message']);
                }));
            });
        };
        HomePage.prototype.init_login_actions = function () {
            var _this = this;
            $('.btn-login').off('click');
            $('.btn-login').click(function () {
                utils.spin($('#login-form'));
                var email = $('#login-form').find('[type="email"]').val();
                var password = $('#login-form').find('[type="password"]').val();
                Backendless.UserService.login(email, password, true, new Backendless.Async(function (res) {
                    utils.unspin($('#login-form'));
                    toastr.success('Login was successfull');
                    _this.app.router.navigate('/account');
                }, function (err) {
                    utils.unspin($('#login-form'));
                    toastr.error(err['message']);
                }));
            });
        };
        return HomePage;
    })(jx_1.Views.HomePage);
});
//# sourceMappingURL=C:/StampDev/SmartAdmin/SmartAdmin/js/views/home/homepage.js.map