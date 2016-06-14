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
    addNew?: boolean,
    editDiv?: boolean,
    divID?: string
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

                        <divs.CompDivs ref="divs_comp" owner={this} />

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

            case 'edit-division': {
                
                this.setState({
                    editDiv: true,
                    divID: data
                });
            } break;


            case 'update_list': {

                (this.refs["divs_comp"] as divs.CompDivs).update();

            } break;
        }

        return Q.resolve(true);
    }
        

    display_editForm() {

        var props: divs.CompDivsEditProps = {
            key: utils.guid(),
            owner:this        
        }

        if (this.state.addNew) {

            this.state.addNew = false;

            props.mode = 'new';
            
        }


        if (this.state.editDiv) {

            this.state.editDiv = false;

            props.mode = 'edit';
            props.id = this.state.divID;
            
        }

        if (props.mode) {            
            return <divs.CompDivsEdit  {...props} />
        }
    }
}