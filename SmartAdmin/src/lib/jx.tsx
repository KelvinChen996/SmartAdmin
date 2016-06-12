// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');


var __router_ctx: any;
var __app: Application.App;
declare var page;



export module Types {

    export interface AppSettings {
        rootpage: string,
        masterpage_template?: string,
        homepage_template?: string,
        viewpath_root?: string
    }


    export interface RouteInfo {
        url: string,
        options?: any
    }


    export interface RouteList {
        [name: string]: RouteInfo
    }

}




export module Views {

    export interface ReactProps extends React.Props<any> {
        owner?: ReactView,
        className?: string
    }


    export interface ReactState {
        loading?: boolean
    }


    export class ReactView extends React.Component<ReactProps, any>{

        state: ReactState;
        props: ReactProps;
        __context: any;

        constructor(props?: ReactProps) {
            
            super(props);

            this.props = props;

            this.state = this.initalize_state();
        }



        get app(): Application.App {
            return __app;
        }


        initalize_state(): ReactState {
            return {
            };
        }


        get root(): JQuery {
            return $(ReactDOM.findDOMNode(this));
        }


        notify(cmd: string, data?: any): Q.Promise<any> {
            return Q.resolve(true);
        }

    }


    export interface MasterPageProps extends ReactProps {
        page_title?: string,
        page_path?: string,
        page_navmenu: string,
        page_content: string,
        pagetemplate?: string,
        //routlist?: Types.RouteList
    }


    export class MasterPage extends ReactView {

        props: MasterPageProps;

        constructor(props: MasterPageProps) {
            super(props);
        }
        

        render() {
            return null;
        }


        get_page_template() {

            var page_tmp = this.props.pagetemplate;

            if (!page_tmp) {
                page_tmp = this.app.settings.masterpage_template;
            }

            return page_tmp;
        }


        componentDidMount() {

            $(this.app.settings.rootpage).load(this.get_page_template(), () => {

                this.init_page();
            });
        }
        

        get root(): JQuery {
            return $(this.app.settings.rootpage);
        }


        get page_navmenu(): JQuery {

            var navmenu = this.props.page_navmenu;
            
            return this.root.find(navmenu);
        }


        get page_content(): JQuery {

            return this.root.find(this.props.page_content);

        }
        

        init_page() {

            this.init_datalinks();
            
            this.resolve_subview();

            this.highlight_active_menu();
        }


        resolve_subview() {

            if (this.app.router.params) {

                var subview = this.app.router.params.subview;

                if (subview) {

                    var routes = this.get_internal_routes();
                    
                    var key = _.find(Object.keys(routes), k => {
                        return k === subview;
                    });
                                        
                    if (key) {
                        
                        var route = routes[key];

                        this.load_subview(route.url);
                    }
                }
            }
        }



        highlight_active_menu() {

        }


        get_internal_routes(): Types.RouteList {
            return {};
        }
        

        init_datalinks() {

            var links = this.page_navmenu.find('[href]');

            _.each(links, href => {

                $(href).click(e => {

                    e.preventDefault();
                    e.stopPropagation();

                    var _href = $(e.currentTarget).attr('href');

                    this.app.router.update_url(_href);
                    
                });               
            });            
        }
        

        load_subview(url: string) {

            var path = '..'+utils.Path.join('/views', url);

            require([path], module => {

                var fn = module[Object.keys(module)[0]];

                ReactDOM.render(fn(), this.page_content[0]);

            });

        }
        
    }
    

    export class HomePage extends MasterPage {

        get_page_template() {

            var page_tmp = this.props.pagetemplate;

            if (!page_tmp) {
                page_tmp = this.app.settings.homepage_template;
            }

            return page_tmp;
        }

    }

}



export module Application {

    export class Router {

        private __app: App;
        constructor(app: App) {
            this.__app = app;
        }

        params: any;
        routes: any;
        ctx: any;

        init_routes(routes: any) {

            this.routes = routes;

            var that = this;

            _.each(Object.keys(routes), (key: string) => {

                var route = routes[key];

                var url = key;

                var view_url: any = route['url'];

                page(url, ctx => {

                    this.ctx = ctx;

                    this.params = ctx.params;

                    var path = '..'+ utils.Path.join('/views', view_url);
                    
                    require([path], mod => {

                        var fn = mod[Object.keys(mod)[0]];

                        ReactDOM.render(fn(), $(that.__app.settings.rootpage)[0]);

                    });
                });
            });
            
            page.start();
            
        }


        update_url(url: string): any {
            return page.show(url, null, false);
        }


        navigate(urlpath: string) {
            return page(urlpath);
        }

    }


    export class App {

        private __router: Router;
        get router(): Router {

            if (!this.__router) {
                this.__router = new Application.Router(this);
            }

            return this.__router;
        }


        private __setts: Types.AppSettings;
        get settings(): Types.AppSettings {
            return this.__setts;        
        }


        get_default_settings() :Types.AppSettings {

            return {

                rootpage: '#root-page',
                masterpage_template: '/html/masterpage.html',
                homepage_template:'/html/homepage.html',
                viewpath_root:''
            }

        }


        load_settings() {

            var d = Q.defer();

            require(['../config/settings'], fn => {

                this.__setts = _.extend(this.get_default_settings(), fn['settings']);

                d.resolve(fn);

            });
            

            return d.promise;
        }


        load_routes() {

            var d = Q.defer();

            require(['../config/routes'], fn => {

                var routes = fn['routes'];

                this.router.init_routes(routes);

                d.resolve(fn);

            });
            
            return d.promise;            
        }


        start_rooter(routes: Types.RouteList) {
            
        }


        load_backendless() {
            
            var APPLICATION_ID = '5F76BFFF-B6EE-F6AB-FFE2-5051554CA500',
                SECRET_KEY = '06A5D87B-83D9-0A58-FF6A-11ABA901C100',
                VERSION = 'v1'; //default application version;
            Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
        }


        start() {

            Q.all([
                this.load_settings(),
                this.load_routes()]).then(() => {

                    this.load_backendless();

                });
            
        }
    }


    export function InitApplication() {

        __app = new Application.App();

        __app.start();
    }

}