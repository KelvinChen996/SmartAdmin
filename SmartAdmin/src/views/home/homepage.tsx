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

    return <HomePage {...props} />
}


class HomePage extends Views.HomePage {
    
    get_internal_routes(): Types.RouteList {

        return {
            'testview': {
                url: 'home/testview'
            }
        };
    }


    init_page() {
        
        super.init_page();

        $('html').attr('id', 'extr-page');
        $('.login').addClass('hidden');
        $('.sign-up').addClass('hidden');

        var subview = this.app.router.params.subview;

        var path = this.app.router['ctx'].path;

        switch (path) {
            case '/signup':
            case '/login': {

                var route = _.find(Object.keys(this.app.router.routes), key => {
                    return key === path;
                });

                if (route) {

                    route = this.app.router.routes[route];

                    if (route['options']) {
                        subview = route['options']['subview'];
                    }
                }
            } break;

        }
        
        switch (subview) {

            case 'signup': {
                $('.sign-up').removeClass('hidden');
            } break;

            
            case 'login':
            default:
                $('.login').removeClass('hidden');
                break;
        }

        this.init_login_actions();

        this.init_signup_actions();
        
    }


    init_signup_actions() {

        $('.btn-signup').off('click');
        $('.btn-signup').click(() => {
             
            utils.spin($('#smart-form-register'));

            var email = $('#signup-email').val();
            var password = $('#signup-password').val();

            var usr = new Backendless.User();

            usr.email = email;
            usr.password = password;
            usr.username = email;

            Backendless.UserService.register(usr, new Backendless.Async(res => {
                utils.unspin($('#smart-form-register'));
                toastr.success('Registration was successfull');
                this.app.router.navigate('/account');
            }, err => {
                utils.unspin($('#smart-form-register'));
                toastr.error(err['message']);
            }));
        });

    }


    init_login_actions() {

        $('.btn-login').off('click');
        $('.btn-login').click(() => {

            utils.spin($('#login-form'));

            var email = $('#login-form').find('[type="email"]').val();
            var password = $('#login-form').find('[type="password"]').val();

            Backendless.UserService.login(email, password, true, new Backendless.Async(res => {
                utils.unspin($('#login-form'));
                toastr.success('Login was successfull');
                this.app.router.navigate('/account');
            }, err => {
                utils.unspin($('#login-form'));
                toastr.error(err['message']);
            }));
            
        });

    }



}