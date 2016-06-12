/// <reference path="../../lib/jx.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');

import { Views, Types } from '../../lib/jx';


export function fn() {
    
    var props: Views.MasterPageProps = {
        page_navmenu: '.navbar',
        page_content: '.page-content',        
    }

    return <Explorer {...props} />
}


class Explorer extends Views.MasterPage {
    
    get_internal_routes(): Types.RouteList {

        return {
            //'*': {
            //    url: 'home/underconstruction'
            //}
        };
    }

    init_page() {

        super.init_page();
        $('html').attr('id', '');
        $('.login').addClass('hidden');
        $('.sign-up').addClass('hidden');

        $('.main').removeClass('hidden');

    }


    resolve_subview() {

        super.resolve_subview();

        if (this.app.router.params) {

            var subview = this.app.router.params.subview;

            if (!this.subroute_exists(subview)) {
                this.load_subview('home/underconstruction');
            }
        } 
    }


    subroute_exists(subroute) {

        var routes = this.get_internal_routes();

        var key = _.find(Object.keys(routes), k => {
            return k === subroute;
        });

        if (!key) {
            return false;
        }

        return true;
    }

}