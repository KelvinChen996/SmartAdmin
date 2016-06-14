/// <reference path="comp_divs.tsx" />
/// <reference path="comp_dept.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../lib/jx');
import divs = require('./comp_divs');
import deps = require('./comp_dept');


import { Views, Types } from '../../lib/jx';



export enum EntryMode { none, add_div, edit_div, add_dep, edit_dep }
interface CompOrgState extends Views.ReactState {
    entrymode?: EntryMode,
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
                    <div className="col-lg-12 edit-div" style={{ padding:0 }}>
                        {this.display_DivEntrView() }
                    </div>
                    <div className="edit-dep" style={{ padding: 0 }}>
                        
                    </div>
                    
                </div>

            </div>;

        return html;
    }    
    
    
    notify(cmd: string, data?: any): Q.Promise<any> {
        
        ReactDOM.unmountComponentAtNode(this.root.find('.edit-dep')[0]);

        switch (cmd) {

            case 'add-new-division': {
                
                this.setState({
                    entrymode: EntryMode.add_div
                } as CompOrgState);
            } break;

            case 'edit-division': {
                
                this.setState({
                    entrymode: EntryMode.edit_div,
                    divID: data
                } as CompOrgState);
            } break;


            case 'update_list': {
                (this.refs["divs_comp"] as divs.CompDivs).update();
            } break;


            case 'add_depart': {

                this.state.entrymode = EntryMode.add_dep;

                ReactDOM.render(<deps.CompDepart />, this.root.find('.edit-dep')[0]);

                $('.div-mode').addClass('hidden');

            } break;
        }

        return Q.resolve(true);
    }
        

    display_DivEntrView() {

        var props: divs.CompDivsEditProps = {
            key: utils.guid(),
            owner:this        
        }

        switch (this.state.entrymode) {

            //case EntrMode.add_dep: {
            //    return <deps.CompDepart />
            //}

            case EntryMode.add_div: {
                props.mode = 'new';
            } break;


            case EntryMode.add_dep:
            case EntryMode.edit_div: {
                props.mode = 'edit';
                props.id = this.state.divID;
            } break;
        }
        
        if (props.mode) {            
            return <divs.CompDivsEdit  {...props} />
        }
    }


    add_new_depart() {

    }
}