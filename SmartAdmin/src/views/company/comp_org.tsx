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
    div_id?: string,
    sel_ids?: any[]
}
export class CompOrg extends Views.ReactView {

    state: CompOrgState;


    render() {

        var html =
            <div className="col-lg-12">

                <jx.controls.BigLabel label="Company divisions" />

                <br />

                <div className="col-lg-6" style={{ paddingLeft: 0 }}>
                    
                    <jx.controls.BoxPanel box_color="blueLight" title="Divisions" icon={<i className="fa fa-cubes"></i>} >

                        <br />

                        <divs.CompDivsTreeView ref="divs_comp" ext_ids={this.state.sel_ids} owner={this} />

                    </jx.controls.BoxPanel>

                </div>

                <div className="col-lg-6">
                    <div className="col-lg-12 edit-div" style={{ padding:0 }}>
                        {this.display_DivEntrView() }
                    </div>
                    <div className="edit-dep" style={{ padding: 0 }}>
                        {this.display_DepartmentEntryView()}
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

                var expnd_list = [];

                _.each(this.root.find('.dd-item.division'), el => {

                    if (!$(el).hasClass('dd-collapsed')) {
                        expnd_list.push(el);
                    }
                });
                

                var selected_ids = _.map(expnd_list, el => {
                    return $(el).attr('data-id');
                });
                
                this.setState({
                    entrymode: EntryMode.edit_div,
                    div_id: data,
                    sel_ids: selected_ids
                } as CompOrgState);
            } break;


            case 'update_list': {
                (this.refs["divs_comp"] as divs.CompDivsTreeView).update();
            } break;


            case 'add_depart': {

                this.setState({
                    entrymode: EntryMode.add_dep,
                    div_id: data,
                    sel_ids: selected_ids
                } as CompOrgState);
                
                //this.state.entrymode = EntryMode.add_dep;

                //ReactDOM.render(<deps.CompDepartment owner={this} div_id={this.state.div_id}  />, this.root.find('.edit-dep')[0]);

                //this.root.find('.edit-mode').addClass('hidden');
                //this.root.find('.view-mode').removeClass('hidden');

            } break;


            case 'edit-department': {

                this.setState({
                    entrymode: EntryMode.edit_dep,
                    div_id: data,
                    sel_ids: selected_ids
                } as CompOrgState);

                //this.setState({
                //    entrymode: EntryMode.edit_dep,
                //    div_id: data.div_id
                //} as CompOrgState);
                
                //this.root.find('.edit-mode').addClass('hidden');
                //this.root.find('.view-mode').removeClass('hidden');

                //ReactDOM.render(<deps.CompDepartment owner={this} div_id={data.div_id} dept_id={data.dept_id}  />, this.root.find('.edit-dep')[0]);

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
            
            case EntryMode.add_div: {
                props.mode = 'new';
            } break;
                
            case EntryMode.edit_div: {
                props.mode = 'edit';
                props.id = this.state.div_id;
            } break;

        }
        
        if (props.mode) {            
            return <divs.CompDivsEdit  {...props} />
        }
    }



    display_DepartmentEntryView() {

        var props: deps.CompDepartmentProps = {
            div_id: null,
            dept_id: null,            
        }

        switch (this.state.entrymode) {
            
            case EntryMode.edit_dep:
            case EntryMode.add_dep: {
                return <deps.CompDepartment  {...props} />    
            }
        }
        
    }


}