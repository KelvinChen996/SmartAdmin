// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX



import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../lib/jx');

import rb = require('react-bootstrap');
var b: any = rb;


import { Views, Types } from '../../lib/jx';



export class CompDepart extends Views.ReactView {

    render() {

        var html =
            <div className="col-lg-12 animated fadeInRight" style={{ padding:0 }}>
                
                <jx.controls.BlackBlox title="Add new department" icon={<i className="fa fa-plus-circle"></i>} >                    
                    {"Department data"}
                </jx.controls.BlackBlox>

            </div>;

        return html;
    }    

}