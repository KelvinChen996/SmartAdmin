/// <reference path="../../lib/jx.tsx" />
/// <reference path="comp_org.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import org = require('./comp_org');

import { Views, Types } from '../../lib/jx';


export function fn() {
    
    var props: Views.MasterPageProps = {
        page_navmenu: '.navbar',
        page_content: '.page-content',        
    }

    return <Explorer {...props} />
}


class Explorer extends Views.MasterPage {

    url_path: string;

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

                switch (this.app.router.ctx.path) {

                    case '/profile':

                        ReactDOM.render(<org.CompOrg />, this.page_content[0]);

                        break;

                    case '/org':

                        ReactDOM.render(<org.CompOrg />, this.page_content[0]);

                        break;

                    default:

                        this.load_subview('home/underconstruction');

                        break;
                }
                
            }
        } 

        this.highlight_active_menu();
    }


    highlight_active_menu() {

        $('#side-menu li').removeClass('active');
        $('#side-menu li').removeClass('open');

        $('#side-menu li').find("b:first").html('<em class="fa fa-plus-square-o"></em>');
        $('#side-menu li').removeClass("open");

        $('#side-menu').find("ul:first").slideUp(235, function () {
            $(this).parent("li").removeClass("open");
            $(this).parent("li").find("b:first").delay(235).html('<em class="fa fa-plus-square-o"></em>');
        });

        var a = $('[href="{0}"]'.format(this.app.router.ctx.path));

        $(a).closest('.menu').addClass('active');

        $(a).closest("ul").slideDown(235, function () {
            
            $(a).parent("li").addClass("open");
            $(a).closest('.menu').find("b:first").delay(235).html('<em class="fa fa-minus-square-o"></em>');
            
        });
        
    }


    activate_menu(a) {
        
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