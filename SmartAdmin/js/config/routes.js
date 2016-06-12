/// <reference path="../lib/jx.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
define(["require", "exports"], function (require, exports) {
    exports.routes = {
        '/': {
            url: 'home/homepage'
        },
        '/signup': {
            url: 'home/homepage',
            options: {
                subview: 'signup'
            }
        },
        '/login': {
            url: 'home/homepage',
            options: {
                subview: 'login'
            }
        },
        '/home/:subview': {
            url: 'home/homepage'
        },
        '/account': {
            url: 'company/explorer'
        },
        '/company/:subview': {
            url: 'company/explorer'
        },
        '*': {
            url: 'home/testview'
        },
    };
});
//# sourceMappingURL=C:/StampDev/SmartAdmin/SmartAdmin/js/config/routes.js.map