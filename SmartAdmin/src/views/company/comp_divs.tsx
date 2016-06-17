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

}

export interface CompDivsTreeViewProps extends Views.ReactProps {
    ext_ids?:any[]
}

export class CompDivsTreeView extends Views.ReactView {

    props: CompDivsTreeViewProps;
    state: CompDivsTreeViewState;

    divs_data: any[];
    depts_data: any[];

    datatable: any;
    selected_id: string;


    constructor(props: CompDivsTreeViewProps) {
        super(props);
        this.divs_data = [];
        this.depts_data = [];

        this.state.loading = true;
    }


    render() {

        var html =
            <div style={{ minHeight: 350 }}>
                <button className="btn btn-primary btn-addnew">
                    <i className="fa fa-plus-circle" aria-hidden="true"></i> Add new division
                </button> 
                <hr/>
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

        if (this.state.loading) {

            this.load_divs_data();

        } else {

            this.init_view();
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

            this.highlight_selection(id);

            this.edit_division(id);
        });


        this.root.find('.btn-add-dept').off('click');
        this.root.find('.btn-add-dept').click(e => {

            e.preventDefault();

            var divs_id = $(this).closest('.division').attr('data-id');

            this.props.owner.notify('add_depart', divs_id);

        });


        this.root.find('.btn-edit-dept').off('click');
        this.root.find('.btn-edit-dept').click(e => {

            e.preventDefault();
            e.stopImmediatePropagation();

            var dept_id = $(e.currentTarget).closest('.department').attr('data-id');
            var div_id = $(e.currentTarget).closest('.division').attr('data-id');

            this.edit_department(div_id, dept_id);
        });

        if (this.selected_id) {
            this.highlight_selection(this.selected_id);
            this.selected_id = null;
        }

        if (this.props.ext_ids) {

            var plugin = this.root.find('.tree-view > .dd').data('nestable');

            _.each(this.props.ext_ids, id => {

                var li = this.root.find('[data-id="{0}"]'.format(id));

                plugin.expandItem(li); 
            });

        }
    }


    update() {

        this.selected_id = this.root.find('.selected').closest('.dd-item').attr('data-id');
        
        this.setState({
            loading: true
        });
    }


    highlight_selection(id: string) {

        this.root.find('.selected').removeClass('selected');
        
        var li = this.root.find('[data-id="{0}"]'.format(id));

        li.find('.dd-handle').first().addClass('selected');
        
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
                            <h4 className="text-primary">
                                <span className="semi-bold">
                                    <a href="#" className="href-div-title" style={{ fontSize: 23 }}>{d['compdiv_title']}</a>
                                </span>
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

                        <div className="content-department">

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

                                        <h4 className="text-primary" style={{ fontSize: 23 }}><span className="semi-bold">{dep['compdept_title']}</span></h4>

                                        <span className="text-muted">{dep['compdept_descr']}</span>

                                        <span className="pull-right hidden">
                                            <a href="#" className="text-primary btn-edit-dept"><i className="fa fa-pencil"></i> edit</a>
                                        </span>

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
export class CompDivsEdit extends Views.ReactView {

    item: any;
    props: CompDivsEditProps;
    
    constructor(props: CompDivsEditProps) {
        super(props);
        this.state.loading = true;
    }


    render() {

        var mode = 'Edit division';

        if (this.props.mode === 'new') {
            mode = 'Add new division';
        }    
        
        var html =
            <form className="animated fadeInRight" >

                <jx.controls.BoxPanel title={mode} box_color="blueLight" icon={<i className="fa fa-edit"></i>} >

                    <b.FormGroup controlId="formControlsText">
                        <jx.controls.BigLabel className="edit-mode" label="Division title" />
                        <b.FormControl type="text" data-bind="textInput:compdiv_title" className="edit-mode" id="compdiv_title" placeholder="Enter a title" />
                        <p data-bind="text:compdiv_title" className="view-mode hidden" style={{ marginTop: 10, fontSize: 32, fontWeight: 100 }} ></p>
                        <p data-bind="text:compdiv_descr" className="view-mode text-muted hidden" style={{ marginTop: 10, fontSize: 32, fontWeight: 100 }} ></p>
                    </b.FormGroup>

                    <div className="edit-mode">

                        <b.FormGroup controlId="formControlsText">
                            <jx.controls.BigLabel label="Division description" />
                            <textarea rows={3} id="compdiv_descr" data-bind="textInput:compdiv_descr" className="custom-scroll form-control" />
                        </b.FormGroup>

                        <br />
                        
                        <button type="button" className="btn btn-danger pull-right btn-cancel" onClick={() => { this.cancel(); } } style={{ marginLeft: 10 }}><i className="fa fa-times"></i> Cancel</button>
                        <button type="button" className="btn btn-primary pull-right btn-save" onClick={() => { this.save(); } }><i className="fa fa-check"></i> Save</button>

                        <br/>


                    </div>

                    
                </jx.controls.BoxPanel>

            </form>;
            

        return html;
    }

    //<button type="button" className="btn btn-info btn-add-dep hidden" onClick={() => { this.add_dept(); } } style={{ marginLeft: 10 }}><i className="fa fa-plus"></i> {"Add department"}</button>

    componentDidMount() {
        
        if (this.state.loading) {
            this.load_data();
        }                
    }


    save() {

        if (this.props.mode === 'new') {

            this.add_new_div()
        } else {

            this.save_div();
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


    componentDidUpdate() {

        if (this.state.loading) {
            this.load_data();
        } else {
            if (this.props.id) {
                ko.cleanNode(this.root[0]);
                ko.applyBindings(this.item, this.root[0]);
            }
        }
        
    }


    save_div() {

        var obj = ko['mapping'].toJS(this.item);

        utils.spin(this.root);

        var model = Backendless.Persistence.of('compdivs');

        model.save(obj, new Backendless.Async(res => {

            toastr.success('Data saved successfully');

            utils.unspin(this.root);

            this.props.owner.notify('update_list');

        }, err => {

            utils.unspin(this.root);

            toastr.error(err['message']);

        }));

    }


    add_new_div() {

        var model = Backendless.Persistence.of('compdivs');
        var obj = new CompDiv();
        obj['usrid'] = Backendless.UserService.getCurrentUser()['objectId'];
        obj['compdiv_title'] = this.root.find('#compdiv_title').val();
        obj['compdiv_descr'] = this.root.find('#compdiv_descr').val();

        utils.spin(this.root);

        model.save(obj, new Backendless.Async(res => {

            toastr.success('Data saved successfully');

            utils.unspin(this.root);

        }, err => {

            utils.unspin(this.root);

            toastr.error(err['message']);

        }));

    }


    load_data() {

        var model = Backendless.Persistence.of('compdivs');

        var qry = new Backendless.DataQuery();

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