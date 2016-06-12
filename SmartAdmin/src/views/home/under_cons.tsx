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

    return <UnderConstructionPage {...props} />
}


class UnderConstructionPage extends Views.ReactView {

    get_internal_routes(): Types.RouteList {

        return {
            'testview': {
                url: 'home/testview'
            }
        };
    }

}