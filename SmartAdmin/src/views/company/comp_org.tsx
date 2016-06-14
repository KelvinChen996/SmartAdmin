/// <reference path="comp_divs.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../lib/jx');
import divs = require('./comp_divs');

import { Views, Types } from '../../lib/jx';



interface CompOrgState extends Views.ReactState {
    addNew?: boolean
}
export class CompOrg extends Views.ReactView {

    state: CompOrgState;

    render() {

        var html =
            <div className="col-lg-12">

                <jx.controls.BigLabel label="Company divisions" />

                <br />

                <div className="col-lg-6" style={{ paddingLeft: 0 }}>
                    
                    <jx.controls.BlackBlox title="Divisions" icon={<i className="fa fa-cubes"></i>} >

                        <br />

                        <divs.CompDivs owner={this} />

                    </jx.controls.BlackBlox>

                </div>

                <div className="col-lg-6">
                    {this.display_editForm()}
                </div>

            </div>;

        return html;
    }    


    componentDidMount() {

        this.state.addNew = false;
    }


    notify(cmd: string, data?: any): Q.Promise<any> {

        switch (cmd) {

            case 'add-new-division': {
                this.setState({
                    addNew: true
                });
            } break;
        }

        return Q.resolve(true);
    }


    display_editForm() {

        if (this.state.addNew) {
            return <divs.CompDivsEdit mode="new" />
        }

    }
}