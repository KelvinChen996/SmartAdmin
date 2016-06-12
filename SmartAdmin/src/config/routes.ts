
/// <reference path="../lib/jx.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import {Types} from '../lib/jx';


export var routes: Types.RouteList = {
    '/': {
        url: 'home/homepage'
    },

    '/signup': {
        url: 'home/homepage',
        options: {
            subview:'signup'
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

    '/org': {
        url: 'company/explorer'
    },

    '/profile': {
        url: 'company/explorer'
    },

    '*': {
        url: 'home/testview'
    },
    
}
