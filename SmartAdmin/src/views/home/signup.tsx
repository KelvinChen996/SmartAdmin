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

    return <Page {...props} />
}


class Page extends Views.ReactView {

    render() {

        return <div></div>;
    }


    componentDidMount() {

        this.root.load('/html/landing_signup.html');
    }
}