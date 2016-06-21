// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../lib/jx');

import rb = require('react-bootstrap');
var b: any = rb;


import { Views, Types } from '../../lib/jx';


interface CompDivsTreeViewState extends Views.ReactState {
    reloading: boolean,
    ext_ids: string[]
}

export interface CompDivsTreeViewProps extends Views.ReactProps {
    ext_ids?: any[],
    reload?: boolean
}

enum ReloadState { none, reloading, has_reloaded }

export class CompDivsTreeView extends Views.ReactView {

    props: CompDivsTreeViewProps;
    state: CompDivsTreeViewState;
    
    divs_data: any[];
    depts_data: any[];

    datatable: any;
    selected_id: string;
    reload_state: ReloadState;



    constructor(props: CompDivsTreeViewProps) {
        super(props);
        this.divs_data = [];
        this.depts_data = [];
        
        this.reload_state = ReloadState.none;
        this.state.loading = true;
    }


    render() {

        if (this.props.reload) {

            if (this.reload_state === ReloadState.none) {

                this.reload_state = ReloadState.reloading;
            }


            if (this.reload_state == ReloadState.reloading) {

                this.state.loading = true;

            }
            
        }


        var html =
            <div style={{ minHeight: 350, marginTop:20 }}>
                <button className="btn btn-primary btn-addnew">
                    <i className="fa fa-plus-circle" aria-hidden="true"></i> Add new division
                </button>
                <hr style={{ marginTop:30 }}/>
                <div className="tree-view">
                    <div className="dd">
                        <ol className="dd-list">
                            {this.build_treelist()}
                        </ol>
                    </div>
                </div>           
            </div>;

        return html;
    }


    componentDidMount() {

        this.init_actions();
        
        if (this.state.loading)
        {
            this.load_divs_data();
        } 
    }


    componentDidUpdate() {

        if (this.props.reload) {

            if (this.reload_state == ReloadState.reloading) {

                this.reload_state = ReloadState.has_reloaded;

                this.load_divs_data();

            } else {

                this.reload_state = ReloadState.none;

                this.init_view();
            }


        } else {

            if (this.state.loading) {

                this.load_divs_data();

            } else {

                this.init_view();
            }
        }
        
    }


    init_view() {

        if (this.divs_data.length > 0) {
            this['nestable'] = this.root.find('.tree-view > .dd')['nestable']().nestable('collapseAll');
        }
        
        this.root.find('.dd-item .href-div-title').click(e => {

            e.preventDefault();
            e.stopImmediatePropagation();

            var id = $(e.currentTarget).closest('.dd-item').attr('data-id');

            this.highlight_comp_division(id);
            this.higlight_comp_dept(null);

            this.display_arrow($(e.currentTarget));

            this.edit_division(id);
        });


        this.root.find('.btn-add-dept').off('click');
        this.root.find('.btn-add-dept').click(e => {

            e.preventDefault();
            e.stopImmediatePropagation();
            
            var divs_id = $(e.currentTarget).closest('.division').attr('data-id');

            this.highlight_comp_division(divs_id);

            this.props.owner.notify('add_depart', divs_id);

        });


        this.root.find('.content-department').off('click');
        this.root.find('.content-department').click(e => {
            
            e.preventDefault();
            e.stopImmediatePropagation();

            var dept_id = $(e.currentTarget).closest('.department').attr('data-id');
            var divs_id = $(e.currentTarget).closest('.division').attr('data-id');

            this.highlight_comp_division(divs_id);
            this.higlight_comp_dept(dept_id);

            this.display_arrow($(e.currentTarget));

            this.edit_department(divs_id, dept_id);
        });

        
        if (this.selected_id) {
            this.highlight_comp_division(this.selected_id);
            this.selected_id = null;
        }

        if (this.state.ext_ids) {

            var plugin = this.root.find('.tree-view > .dd').data('nestable');

            _.each(this.state.ext_ids, id => {

                var li = this.root.find('[data-id="{0}"]'.format(id));

                plugin.expandItem(li); 
            });
        }
    }


    display_arrow($el) {

        this.root.find('.fa-arrow-right').addClass('hidden');
        $el.find('.fa-arrow-right').removeClass('hidden');
    }


    update(extended_ids: string[]) {

        this.selected_id = this.root.find('.selected').closest('.dd-item').attr('data-id');

        this.state.ext_ids = extended_ids;

        this.setState({
            loading: true
        });
    }


    highlight_comp_division(id: string) {

        this.root.find('.selected').removeClass('selected');
        
        var li = this.root.find('[data-id="{0}"]'.format(id));

        li.find('.dd-handle').first().addClass('selected');
        
    }


    higlight_comp_dept(id: string) {

        this.root.find('.dept-selected').removeClass('dept-selected');

        var li = this.root.find('[data-id="{0}"]'.format(id));

        li.find('.dd-handle').first().addClass('dept-selected');

    }


    edit_division(id: string) {
        this.props.owner.notify('edit-division', id);
    }


    edit_department(div_id: string, dept_id: string) {

        this.props.owner.notify('edit-department', {
            div_id: div_id,
            dept_id: dept_id
        });
    }

    
    load_divs_data() {

        var model = Backendless.Persistence.of('compdivs');

        var qry = new Backendless.DataQuery();

        qry.condition = "usrid = '{0}'".format(Backendless.UserService.getCurrentUser()['objectId']);
        qry.options = { relations: ["depts"] };

        var d = Q.defer();

        utils.spin(this.root);

        model.find(qry, new Backendless.Async((res:any) => {

            this.divs_data = res.data;

            utils.unspin(this.root);

            this.setState({
                loading: false                
            });

            d.resolve(true);

        }, err => {

            utils.unspin(this.root);

            this.setState({
                loading: false
            });

            d.reject(false);

        }));

        return d.promise;        
    }
    
    
    build_treelist() {
        
        var count = 1;

        var nodes = _.map(this.divs_data, d => {
            
            var item =
                <li className="dd-item division" data-id={d['objectId']} style={{ cursor: 'pointer', }}>
                    <div className="dd-handle dd-nodrag">
                        <div className="content">
                            <h4 className="text-primary href-div-title">
                                <span className="semi-bold">
                                    <a href="#" className="" style={{ fontSize: 23 }}>{d['compdiv_title']}</a>
                                </span>
                                <span className="fa fa-arrow-right pull-right text-danger hidden"></span>
                            </h4>
                            <span className="text-muted"><small>{d['compdiv_descr']}</small></span>
                            
                        </div>                        
                    </div>       
                    {this.load_departments(d) }                     
                </li>

            return item;
        });

        return nodes;
    }
    

    load_departments(div: any) {

        var that = this;

        var depts: any[] = div['depts'];

        var html =
            <ol className="dd-list">

                <li className="dd-item department dd-nodrag" data-id={utils.guid() }>

                    <div className="dd-handle dd-nodrag">

                        <div className="">

                                <span className="text-info"><strong>Departments</strong></span>
                            
                                <span className="pull-right">
                                    <a href="#" className="btn btn-info btn-xs btn-add-dept"><i className="fa fa-plus"> {"add new"}</i></a>
                                </span>
                                
                            </div>    
                    </div>
                </li>
                {
                    _.map(depts, dep => {

                        var li =
                            <li className="dd-item department dd-nodrag" data-id={dep['objectId']} >

                                <div className="dd-handle dd-nodrag">

                                    <div className="content-department">

                                        <h4 className="text-primary" style={{ fontSize: 23 }}>
                                            <span className="semi-bold">{dep['compdept_title']}</span>
                                            <span className="fa fa-arrow-right pull-right text-danger hidden"></span>
                                        </h4>

                                        <span className="text-muted">{dep['compdept_descr']}</span>
                                        
                                    </div>
                                    
                                </div>

                            </li>

                        return li;
                    })
                }
            </ol> 

        return html;
    }
    

    init_actions() {

        this.root.find('.btn-addnew').off('click');
        this.root.find('.btn-addnew').click(() => {
            this.props.owner.notify('add-new-division');
        });
    }    
}






export interface CompDivsEditProps extends Views.ReactProps {
    mode?: string,
    id?: string
}

enum OpenMode { add, edit }

interface CompDivsEditState extends Views.ReactState {
    openmode: OpenMode
}
export class CompDivsEdit extends Views.ReactView {

    item: any;
    props: CompDivsEditProps;
    state: CompDivsEditState;
    
    constructor(props: CompDivsEditProps) {
        super(props);

        this.state.loading = true;
        this.state.openmode = OpenMode.edit;

        if (this.props.mode === 'new') {
            this.state.openmode = OpenMode.add;
        }
    }


    render() {

        var that = this;

        var mode = 'Company division';

        if (this.state.openmode === OpenMode.add) {
            mode = 'Add new division';
        }    
        
        var html =
            <form className="animated fadeInRight" >
                
                <jx.controls.BoxPanel title={mode} box_color="blueLight" icon={<i className="fa fa-edit"></i>} >

                    <b.Row style={{ paddingTop: 30 }}>
                        <b.Col xs={12}>
                            <jx.controls.BigLabel label="Company division" inline={true} />
                            <button href="#" className="btn btn-primary pull-right view-mode btn-edit hidden" onClick={(e) => { e.preventDefault(); that.enter_editmode() } } style={{ marginTop: 5 }}><i className="fa fa-edit"></i> edit</button>
                            <button href="#" className="pull-right btn btn-danger edit-mode btn-cancel" onClick={(e) => { e.preventDefault(); that.cancel_editmode() } } style={{ marginLeft: 10, marginTop: 5 }}><i className="fa fa-times"></i> cancel</button>
                            <button href="#" className="pull-right btn btn-primary edit-mode btn-save" onClick={(e) => { e.preventDefault(); that.save() } } style={{ marginTop: 5 }}><i className="fa fa-check"></i> save</button>
                        </b.Col>                        
                    </b.Row>

                    <hr/>

                    <b.FormGroup controlId="formControlsText">
                        <jx.controls.BigLabel label="Title" />
                        <b.FormControl type="text" data-bind="textInput:compdiv_title" style={{ height: 50, fontSize:20}}
                            className="edit-mode" id="compdiv_title" placeholder="Enter a title" />
                        <p data-bind="text:compdiv_title" className="view-mode hidden" style={{ marginTop: 10, fontSize: 32, fontWeight: 100 }} ></p>
                    </b.FormGroup>

                    <br/>

                    <b.FormGroup controlId="formControlsText">
                        <jx.controls.BigLabel label="Description" />
                        <textarea rows={3} id="compdiv_descr" style={{ fontSize: 20 }} placeholder="Enter a description"
                            data-bind="textInput:compdiv_descr" className="custom-scroll edit-mode form-control" />
                        <p data-bind="text:compdiv_descr" className="view-mode hidden" style={{ marginTop: 10, fontSize: 32, fontWeight: 100 }} ></p>
                    </b.FormGroup>

                    <br />

                    <button type="button" className="btn btn-danger pull-right btn-cancel hidden" onClick={() => { this.cancel(); } } style={{ marginLeft: 10 }}><i className="fa fa-times"></i> Cancel</button>
                    <button type="button" className="btn btn-primary pull-right btn-save hidden" onClick={() => { this.save(); } }><i className="fa fa-check"></i> Save</button>

                    <br/>

                    
                </jx.controls.BoxPanel>

            </form>;
            

        return html;
    }

    //<button type="button" className="btn btn-info btn-add-dep hidden" onClick={() => { this.add_dept(); } } style={{ marginLeft: 10 }}><i className="fa fa-plus"></i> {"Add department"}</button>

    componentDidMount() {

        if (this.state.loading) {

            this.load_data().then(() => {

                if (this.state.openmode === OpenMode.add) {
                    this.enter_editmode();
                }

            });
        }                
    }


    componentDidUpdate() {

        if (this.state.loading)
        {
            this.load_data();
        } else {

            if (this.state.openmode === OpenMode.add) {
                this.enter_editmode();
            }

            if (this.props.id)
            {
                ko.cleanNode(this.root[0]);
                ko.applyBindings(this.item, this.root[0]);
            }
        }

    }


    cancel_editmode() {

        this.exit_editmode();
    }


    exit_editmode() {

        //this.root.find('.view-mode').removeClass('hidden');

        //this.root.find('.edit-mode').addClass('hidden');
    }


    enter_editmode() {

        //this.root.find('.view-mode').addClass('hidden');

        //this.root.find('.edit-mode').removeClass('hidden');
    }

    
    save() {

        if (this.props.mode === 'new') {

            this.add_new_div().then(() => {

                this.exit_editmode();
            });

        } else {

            this.save_div().then(() => {

                this.exit_editmode();

            });
        }
    }


    cancel() {

        this.setState({
            loading: true
        });
    }


    add_dept() {

        this.props.owner.notify('add_depart');
    }


    save_div() {

        var obj = ko['mapping'].toJS(this.item);

        if (!obj || !obj['compdiv_title']) {
            toastr.error('Title not found');
            return Q.reject(false);
        }

        utils.spin(this.root);

        var model = Backendless.Persistence.of('compdivs');

        var d = Q.defer();

        model.save(obj, new Backendless.Async(res => {

            toastr.success('Data saved successfully');

            utils.unspin(this.root);

            this.props.owner.notify('update_list');

            d.resolve(true);

        }, err => {

            utils.unspin(this.root);

            toastr.error(err['message']);

            d.reject(false);
        }));

        return d.promise;
    }


    add_new_div() {

        var model = Backendless.Persistence.of('compdivs');
        var obj = new CompDiv();
        obj['usrid'] = Backendless.UserService.getCurrentUser()['objectId'];
        obj['compdiv_title'] = this.root.find('#compdiv_title').val();
        obj['compdiv_descr'] = this.root.find('#compdiv_descr').val();

        if (!obj || !obj['compdiv_title']) {
            toastr.error('Title not found');
            return Q.reject(false);
        }

        utils.spin(this.root);

        var d = Q.defer();

        model.save(obj, new Backendless.Async(res => {

            toastr.success('Data saved successfully');

            utils.unspin(this.root);

            this.props.owner.notify('update_list');

            d.resolve(true);

        }, err => {

            utils.unspin(this.root);

            toastr.error(err['message']);

            d.reject(false);

        }));

        return d.promise;
    }


    load_data() {

        var model = Backendless.Persistence.of('compdivs');

        var qry = new Backendless.DataQuery();

        if (!this.props.id) {
            return Q.resolve(false);
        }

        qry.condition = "objectId = '{0}'".format(this.props.id);

        var d = Q.defer();

        utils.spin(this.root);

        var that = this;

        model.find(qry, new Backendless.Async((res: any) => {
                        
            that.item = ko['mapping'].fromJS(res.data[0]);

            utils.unspin(this.root);

            this.setState({
                loading: false
            });

            d.resolve(true);

        }, err => {

            utils.unspin(this.root);

            this.setState({
                loading: false
            });

            d.reject(false);

        }));

        return d.promise;

    }
}


class CompDiv {
    usrid: string
    compdiv_title: string
}