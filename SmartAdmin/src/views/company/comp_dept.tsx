// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX



import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../lib/jx');

import rb = require('react-bootstrap');
var b: any = rb;


import { Views, Types } from '../../lib/jx';


enum ReloadState { none, reloading, has_reloaded }

export interface CompDepartmentProps extends Views.ReactProps {
    div_id: string,
    dept_id?: string,
    reload?: boolean
}

enum OpenMode { none, add, edit }

export interface CompDepartmentState extends Views.ReactState {
    dept_id: string,
    openmode: OpenMode
}
export class CompDepartment extends Views.ReactView {

    constructor(props: CompDepartmentProps) {
        super(props);

        this.state.loading = true;
        this.state.dept_id = this.props.dept_id;
        this.state.openmode = OpenMode.none;

        this.reload_state = ReloadState.none;
    
    }

    div_obj: any;
    item: any;
    props: CompDepartmentProps;
    state: CompDepartmentState;
    
    reload_state: ReloadState;


    render() {

        if (this.reload_state != ReloadState.reloading) {
            this.state.dept_id = this.props.dept_id;
        }

        var that = this;

        var title = 'Add new department';
        var icon = <i className="fa fa-plus-circle"></i>;

        if (!this.isNew) {
            title = 'Company department';
            icon = <i className="fa fa-edit"></i>;
        } else {
            this.state.openmode = OpenMode.add;
        }

        var can_add_emps = this.isNew ? 'hidden' : null;

        var html =
            <div className="col-lg-12 animated fadeInRight" style={{ padding: 0 }}>
                
                <jx.controls.BoxPanel title={title} box_color="blueLight" icon={icon}>

                    <form>

                        <b.Row style={{ paddingTop: 30 }}>
                            <b.Col xs={12}>
                                <jx.controls.BigLabel label="Company department" inline={true} />
                                <button href="#" className="btn btn-primary pull-right view-mode hidden btn-edit" onClick={(e) => { e.preventDefault(); that['enter_editmode']() } } style={{ marginTop: 5 }}><i className="fa fa-edit"></i> edit</button>
                                <button href="#" className="btn btn-danger pull-right edit-mode btn-cancel" onClick={(e) => { e.preventDefault(); that['cancel_editmode']() } } style={{ marginLeft: 10, marginTop: 5 }}><i className="fa fa-times"></i> cancel</button>
                                <button href="#" className="btn btn-primary pull-right edit-mode btn-save" onClick={(e) => { e.preventDefault(); that.save() } } style={{ marginTop: 5 }}><i className="fa fa-check"></i> save</button>
                            </b.Col>
                        </b.Row>

                        <hr />

                        <b.FormGroup controlId="formControlsText">
                            <jx.controls.BigLabel label="Title" />
                            <b.FormControl type="text" className="edit-mode" style={{ height: 50, fontSize: 20 }}
                                data-bind="textInput:compdept_title" placeholder="Enter a title" />  
                            <p data-bind="text:compdept_title" className="view-mode hidden" style={{ marginTop: 10, fontSize: 32, fontWeight: 100 }} ></p>     
                        </b.FormGroup>

                        <br />

                        <b.FormGroup controlId="formControlsText">
                            <jx.controls.BigLabel label="Description" />                            
                            <textarea rows={3} id="compdept_descr" style={{ fontSize: 20 }}
                                data-bind="textInput:compdept_descr" className="custom-scroll form-control edit-mode" />
                            <p data-bind="text:compdept_descr" className="view-mode hidden" style={{ marginTop: 10, fontSize: 32, fontWeight: 100 }} ></p>
                        </b.FormGroup>
                        
                    </form>

                    <br/>

                    <hr />

                    {this.display_emplistview()}
                    
                    

                </jx.controls.BoxPanel>
                
            </div>;

        return html;
    }    


    display_emplistview() {

        if (!this.isNew) {

            return <EmplistView ref="emplist" />
        }

    }


    get isNew(): boolean {
        return !this.state.dept_id;

    }


    componentDidMount() {

        ko.cleanNode(this.root[0]);

        this.load_data().then(() => {

            if (this.state.openmode != OpenMode.none) {
                this.enter_editmode();
            }

            ko.applyBindings(this.item, this.root[0]);
        });
    }


    componentDidUpdate() {

        if (this.reload_state === ReloadState.reloading) {
            this.reload_state = ReloadState.none;
        }

        if (this.state.openmode != OpenMode.none) {
            this.enter_editmode();
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


    load_data() {

        utils.spin(this.root);

        var model = Backendless.Persistence.of('compdivs');

        var qry = new Backendless.DataQuery();

        qry.condition = "objectId = '{0}'".format(this.props.div_id);

        qry.options = { relations: ["depts"] };

        var that = this;

        var d = Q.defer();

        var that = this;

        model.find(qry, new Backendless.Async((res: any) => {

            this.div_obj = res.data[0];

            if (!that.isNew) {

                var dept = _.find(res.data[0].depts, dep => {
                    return dep['objectId'] === this.props.dept_id;
                });

                that.item = ko['mapping'].fromJS(dept);

            } else {

                var obj = _.extend(new CompDept(), {
                    ___class:'compdept',
                    compdivs_id: this.div_obj['objectId'],
                    compdept_title: '',
                    compdept_descr: ''
                });

                this.item = ko['mapping'].fromJS(obj);
                
            }
            
            utils.unspin(this.root);
            
            d.resolve(that.item);

        }));

        return d.promise;

    }


    save() {

        if (this.isNew) {

            this.add_new_div().then(() => {

                this.reload_state = ReloadState.reloading;

                this.setState({
                    loading: true,
                    openmode: OpenMode.none
                });
            });

        } else {

            this.save_div().then(() => {

                this.reload_state = ReloadState.reloading;

                this.setState({
                    loading: true,
                    openmode: OpenMode.none
                });

            });
        }
    }


    save_div() {

        var obj = ko['mapping'].toJS(this.item);

        utils.spin(this.root);

        var model = Backendless.Persistence.of('compdept');

        var d = Q.defer();

        model.save(obj, new Backendless.Async(res => {

            this.state.dept_id = res['objectId'];

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
        
        var obj = ko['mapping'].toJS(this.item);
        

        obj['compdept_title'] = this.root.find('[data-bind="textInput:compdept_title"]').val();
        obj['compdept_descr'] = this.root.find('[data-bind="textInput:compdept_descr"]').val();

        this.div_obj['depts'].push(obj);

        var d = Q.defer();

        utils.spin(this.root);

        model.save(this.div_obj, new Backendless.Async(res => {

            toastr.success('Data saved successfully');

            this.state.dept_id = res['objectId'];

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


    add_employees() {

        (this.refs['emplist'] as EmplistView).add_mail_control();

    }


    cancel() {

        this.setState({
            loading: true
        });
    }
}


class CompDept {
    
    compdivs_id: string
    compdept_descr: string
    compdept_title: string
}



interface EmplistViewprops extends jx.Views.ReactProps {
    isnew?: boolean
}
class EmplistView extends jx.Views.ReactView {

    props: EmplistViewprops;

    constructor(props: EmplistViewprops) {
        super(props);        
    }

    render() {
        
        var html =
            <div className="emplist-root">
                
                <div className={"row" }>

                    <div className="col-lg-12">

                        <jx.controls.BigLabel label="Employees" />
                        <br />
                        <button type="button" className="btn btn-primary btn-add-emps" onClick={() => { this.add_mail_control() } }><i className="fa fa-user"></i> Add employees</button>
                        <button className="btn btn-warning pull-right edit-mode hidden"><i className="fa fa-times" aria-hidden="true"></i> Cancel</button>
                        <button className="btn btn-primary pull-right edit-mode hidden" onClick={() => { this.send_emails() } } style={{ marginRight: 10 }}><i className="fa fa-envelope-o" aria-hidden="true"></i> Send</button>
                        
                    </div>

                </div>

                <div className="row edit-mode hidden" style={{ paddingLeft: 10, paddingRight:20 }}>
                    <br />
                    <div className="alert alert-block alert-warning" style={{ borderLeftWidth:'5px!important' }}>
                        <h4 className="alert-heading">
                            Add employees
                        </h4>
                        <p>{'Enter your employees email and the system will automatically send them inviations. Keep pressing "Add employee" to add more employees. Then press "Send" to send invitation mails'}</p>
                    </div>
                    <br />
                </div>


                <div className="emps-list">

                </div>
            </div>

        return html;

    }


    add_mail_control() {

        var root = $('<div></div>').appendTo(this.root.find('.emps-list'));

        this.root.find('.edit-mode').removeClass('hidden');

        ReactDOM.render(<EmailControl />, root[0]);

    }


    send_emails() {

        var mails = _.map(this.root.find('[type="email"]'), p => {

            return $(p).val();
        });

        mails = _.filter(mails, (m: string) => {
            return m.trim().length > 0
        });

        // create employees
    }
}


class EmailControl extends jx.Views.ReactView {

    render() {

        var html =
            <form className="text-clear smart-form">
                <fieldset style={{ paddingTop:0 }}>
                    <label className="input">
                        <i className="icon-append fa fa-times btn-icon hover"></i>
                        <input type="email" name="email" placeholder="Enter an invitation email"/>
                    </label>
                </fieldset>                
            </form>


        return html;
    }


    componentDidMount() {

        

        this.root.find('.btn-icon').click(e => {

            e.preventDefault();

            this.root.slideUp({
                complete: () => {
                    this.root.remove()
                }
            });
        });

        //this.root.find('.glyphicon').css('margin-top', '5px');
    }
}