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
    dept_id?: string,
    sel_ids?: any[],
    reload_tree?: boolean
}
export class CompOrg extends Views.ReactView {

    state: CompOrgState;
    skip: boolean;

    render() {

        var reload = this.state.reload_tree;

        if (reload) {
            this.state.reload_tree = false;
        }

        var html =
            <div className="col-lg-12">

                <jx.controls.BigLabel label="Company divisions" />

                <br />

                <div className="col-lg-6" style={{ paddingLeft: 0 }}>
                    
                    <jx.controls.BoxPanel box_color="blueLight" title="Divisions" icon={<i className="fa fa-cubes"></i>} >

                        <br />

                        <divs.CompDivsTreeView ref="divs_comp" ext_ids={this.state.sel_ids} reload={reload} owner={this} />

                    </jx.controls.BoxPanel>

                </div>

                <div className="col-lg-6 dataentry">
                    
                </div>
                
            </div>;

        return html;
    }    


    get_expanded_node_ids() {

        var expand_list = [];

        _.each(this.root.find('.dd-item.division'), el => {

            if (!$(el).hasClass('dd-collapsed')) {
                expand_list.push(el);
            }
        });
        
        var selected_ids = _.map(expand_list, el => {
            return $(el).attr('data-id');
        });

        return selected_ids;
    }
    
    
    notify(cmd: string, data?: any): Q.Promise<any> {

        //if (this.skip) {
        //    this.skip = false;
        //    return;
        //}

        //this.skip = true;

        ReactDOM.unmountComponentAtNode(this.root.find('.dataentry')[0]);

        switch (cmd) {

            case 'add-new-division': {

                this.state.entrymode = EntryMode.add_div;

                ReactDOM.render(this.display_DivEntrView(), this.root.find('.dataentry')[0]);

            } break;

            case 'edit-division': {
                
                var selected_ids = this.get_expanded_node_ids();

                _.extend(this.state, {
                    entrymode: EntryMode.edit_div,
                    div_id: data,
                    sel_ids: selected_ids
                });

                ReactDOM.render(this.display_DivEntrView(), this.root.find('.dataentry')[0]);


            } break;


            case 'update_list': {

                var ext_id = this.root.find('.selected').closest('.dd-item').attr('data-id');

                var ids: string[] = null;

                if (ext_id) {
                    ids = [ext_id];
                }

                (this.refs['divs_comp'] as divs.CompDivsTreeView).update(ids);
                
            } break;


            case 'add_depart': {

                var selected_ids = this.get_expanded_node_ids();

                _.extend(this.state, {
                    entrymode: EntryMode.add_dep,
                    div_id: data,
                    dept_id: null,
                    sel_ids: selected_ids
                });
                
                ReactDOM.render(this.display_DepartmentEntryView(), this.root.find('.dataentry')[0]);
                
            } break;


            case 'edit-department': {

                var selected_ids = this.get_expanded_node_ids();

                _.extend(this.state, {
                    entrymode: EntryMode.edit_dep,
                    div_id: data.div_id,
                    dept_id: data.dept_id,
                    sel_ids: selected_ids
                });

                ReactDOM.render(this.display_DepartmentEntryView(), this.root.find('.dataentry')[0]);
                
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
            div_id: this.state.div_id,
            dept_id: this.state.dept_id,
            owner: this                
        }
        
        switch (this.state.entrymode) {
            
            case EntryMode.edit_dep:
            case EntryMode.add_dep: {
                
                this.state.entrymode = EntryMode.none;

                return <deps.CompDepartment  {...props} />    
            }
        }
        
    }


}