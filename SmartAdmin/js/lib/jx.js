// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom'], function (require, exports, React, ReactDOM) {
    var __router_ctx;
    var __app;
    var Views;
    (function (Views) {
        var ReactView = (function (_super) {
            __extends(ReactView, _super);
            function ReactView(props) {
                _super.call(this, props);
                this.props = props;
                this.state = this.initalize_state();
            }
            Object.defineProperty(ReactView.prototype, "app", {
                get: function () {
                    return __app;
                },
                enumerable: true,
                configurable: true
            });
            ReactView.prototype.initalize_state = function () {
                return {};
            };
            Object.defineProperty(ReactView.prototype, "root", {
                get: function () {
                    return $(ReactDOM.findDOMNode(this));
                },
                enumerable: true,
                configurable: true
            });
            ReactView.prototype.notify = function (cmd, data) {
                return Q.resolve(true);
            };
            return ReactView;
        })(React.Component);
        Views.ReactView = ReactView;
        var MasterPage = (function (_super) {
            __extends(MasterPage, _super);
            function MasterPage(props) {
                _super.call(this, props);
            }
            MasterPage.prototype.render = function () {
                return null;
            };
            MasterPage.prototype.get_page_template = function () {
                var page_tmp = this.props.pagetemplate;
                if (!page_tmp) {
                    page_tmp = this.app.settings.masterpage_template;
                }
                return page_tmp;
            };
            MasterPage.prototype.componentDidMount = function () {
                var _this = this;
                $(this.app.settings.rootpage).load(this.get_page_template(), function () {
                    _this.init_page();
                });
            };
            Object.defineProperty(MasterPage.prototype, "root", {
                get: function () {
                    return $(this.app.settings.rootpage);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MasterPage.prototype, "page_navmenu", {
                get: function () {
                    var navmenu = this.props.page_navmenu;
                    return this.root.find(navmenu);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MasterPage.prototype, "page_content", {
                get: function () {
                    return this.root.find(this.props.page_content);
                },
                enumerable: true,
                configurable: true
            });
            MasterPage.prototype.init_page = function () {
                this.init_datalinks();
                this.resolve_subview();
            };
            MasterPage.prototype.resolve_subview = function () {
                if (this.app.router.params) {
                    var subview = this.app.router.params.subview;
                    if (subview) {
                        var routes = this.get_internal_routes();
                        var key = _.find(Object.keys(routes), function (k) {
                            return k === subview;
                        });
                        if (key) {
                            var route = routes[key];
                            this.load_subview(route.url);
                        }
                    }
                }
            };
            MasterPage.prototype.get_internal_routes = function () {
                return {};
            };
            MasterPage.prototype.init_datalinks = function () {
                var _this = this;
                var links = this.page_navmenu.find('[href]');
                _.each(links, function (href) {
                    $(href).click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var _href = $(e.currentTarget).attr('href');
                        _this.app.router.update_url(_href);
                    });
                });
            };
            MasterPage.prototype.load_subview = function (url) {
                var _this = this;
                var path = '..' + utils.Path.join('/views', url);
                require([path], function (module) {
                    var fn = module[Object.keys(module)[0]];
                    ReactDOM.render(fn(), _this.page_content[0]);
                });
            };
            return MasterPage;
        })(ReactView);
        Views.MasterPage = MasterPage;
        var HomePage = (function (_super) {
            __extends(HomePage, _super);
            function HomePage() {
                _super.apply(this, arguments);
            }
            HomePage.prototype.get_page_template = function () {
                var page_tmp = this.props.pagetemplate;
                if (!page_tmp) {
                    page_tmp = this.app.settings.homepage_template;
                }
                return page_tmp;
            };
            return HomePage;
        })(MasterPage);
        Views.HomePage = HomePage;
    })(Views = exports.Views || (exports.Views = {}));
    var Application;
    (function (Application) {
        var Router = (function () {
            function Router(app) {
                this.__app = app;
            }
            Router.prototype.init_routes = function (routes) {
                var _this = this;
                this.routes = routes;
                var that = this;
                _.each(Object.keys(routes), function (key) {
                    var route = routes[key];
                    var url = key;
                    var view_url = route['url'];
                    page(url, function (ctx) {
                        _this.ctx = ctx;
                        _this.params = ctx.params;
                        var path = '..' + utils.Path.join('/views', view_url);
                        require([path], function (mod) {
                            var fn = mod[Object.keys(mod)[0]];
                            ReactDOM.render(fn(), $(that.__app.settings.rootpage)[0]);
                        });
                    });
                });
                page.start();
            };
            Router.prototype.update_url = function (url) {
                return page.show(url, null, false);
            };
            Router.prototype.navigate = function (urlpath) {
                return page(urlpath);
            };
            return Router;
        })();
        Application.Router = Router;
        var App = (function () {
            function App() {
            }
            Object.defineProperty(App.prototype, "router", {
                get: function () {
                    if (!this.__router) {
                        this.__router = new Application.Router(this);
                    }
                    return this.__router;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(App.prototype, "settings", {
                get: function () {
                    return this.__setts;
                },
                enumerable: true,
                configurable: true
            });
            App.prototype.get_default_settings = function () {
                return {
                    rootpage: '#root-page',
                    masterpage_template: '/html/masterpage.html',
                    homepage_template: '/html/homepage.html',
                    viewpath_root: ''
                };
            };
            App.prototype.load_settings = function () {
                var _this = this;
                var d = Q.defer();
                require(['../config/settings'], function (fn) {
                    _this.__setts = _.extend(_this.get_default_settings(), fn['settings']);
                    d.resolve(fn);
                });
                return d.promise;
            };
            App.prototype.load_routes = function () {
                var _this = this;
                var d = Q.defer();
                require(['../config/routes'], function (fn) {
                    var routes = fn['routes'];
                    _this.router.init_routes(routes);
                    d.resolve(fn);
                });
                return d.promise;
            };
            App.prototype.start_rooter = function (routes) {
            };
            App.prototype.load_backendless = function () {
                var APPLICATION_ID = '5F76BFFF-B6EE-F6AB-FFE2-5051554CA500', SECRET_KEY = '06A5D87B-83D9-0A58-FF6A-11ABA901C100', VERSION = 'v1'; //default application version;
                Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
            };
            App.prototype.start = function () {
                var _this = this;
                Q.all([
                    this.load_settings(),
                    this.load_routes()]).then(function () {
                    _this.load_backendless();
                });
            };
            return App;
        })();
        Application.App = App;
        function InitApplication() {
            __app = new Application.App();
            __app.start();
        }
        Application.InitApplication = InitApplication;
    })(Application = exports.Application || (exports.Application = {}));
    var controls;
    (function (controls) {
        var BlackBlox = (function (_super) {
            __extends(BlackBlox, _super);
            function BlackBlox() {
                _super.apply(this, arguments);
            }
            BlackBlox.prototype.render = function () {
                var html = React.createElement("div", {"className": "jarviswidget jarviswidget-color-white", "data-widget-attstyle": "jarviswidget-color-white", "data-widget-editbutton": "false"}, React.createElement("header", null, React.createElement("span", {"className": "widget-icon"}, " ", this.props.icon, " "), React.createElement("h2", null, this.props.title)), React.createElement("div", {"style": { paddingBottom: 20 }}, React.createElement("div", {"className": "jarviswidget-editbox"}), React.createElement("div", {"className": "widget-body no-padding"}, React.createElement("div", {"className": "col-lg-12"}, this.props.children))));
                return html;
            };
            return BlackBlox;
        })(Views.ReactView);
        controls.BlackBlox = BlackBlox;
        var BigLabel = (function (_super) {
            __extends(BigLabel, _super);
            function BigLabel(props) {
                _super.call(this, props);
            }
            BigLabel.prototype.render = function () {
                var html = React.createElement("div", {"className": "breadcrumb-wrapper"}, React.createElement("p", {"className": "label-value", "style": { fontSize: 32, fontWeight: 100 }}, this.format_label(), this.is_required()));
                return html;
            };
            BigLabel.prototype.format_label = function () {
                if (this.props.lang) {
                    return React.createElement("span", {"data-localize": this.props.lang}, "this.props.label");
                }
                else {
                    return this.props.label;
                }
            };
            BigLabel.prototype.is_required = function () {
                if (this.props.require) {
                    return React.createElement("span", {"className": "required"}, "*");
                }
            };
            return BigLabel;
        })(Views.ReactView);
        controls.BigLabel = BigLabel;
    })(controls = exports.controls || (exports.controls = {}));
});
//# sourceMappingURL=C:/StampDev/SmartAdmin/SmartAdmin/js/lib/jx.js.map