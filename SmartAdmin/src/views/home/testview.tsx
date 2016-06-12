/// <reference path="../../lib/jx.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');

import { Views } from '../../lib/jx';


export function fn() {
    return <TestView />
}


class TestView extends Views.ReactView{

    render(){
        return <div>Test view</div>
    }

}