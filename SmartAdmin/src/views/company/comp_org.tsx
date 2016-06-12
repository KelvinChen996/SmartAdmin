// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');

import { Views, Types } from '../../lib/jx';



export class CompOrg extends Views.ReactView {

    render() {

        return <div>Company org</div>;
    }

    
}