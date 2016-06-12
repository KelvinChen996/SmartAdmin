// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../lib/jx');

import rb = require('react-bootstrap');
var b: any = rb;


import { Views, Types } from '../../lib/jx';


interface CompDivsState extends Views.ReactState {

}

export interface CompDivsProps extends Views.ReactProps {
}

export class CompDivs extends Views.ReactView {

    props: CompDivsProps;
    state: CompDivsState;
    data: any[];
    datatable: any;


    constructor(props: CompDivsProps) {
        super(props);

        this.state.loading = true;
    }

    render() {

        var html =
            <div style={{ minHeight: 350 }}>
                <button className="btn btn-primary btn-addnew">
                    <i className="fa fa-plus-circle" aria-hidden="true"></i> Add new division
                </button> 
                <hr/>
                <div className="datalist" style={{ fontSize: 18}}>
                    <table className="table" style={{ width:'100%' }}>
                    </table>
                </div>           
            </div>;

        return html;
    }


    componentDidMount() {

        this.init_actions();

        if (this.state.loading) {
            this.load_data();
        } 
    }


    componentDidUpdate() {

        this.display_datatable();
    }


    load_data() {

        var model = Backendless.Persistence.of('compdivs');

        var qry = new Backendless.DataQuery();

        qry.condition = "usrid = '{0}'".format(Backendless.UserService.getCurrentUser()['objectId']);

        var d = Q.defer();

        utils.spin(this.root);

        model.find(qry, new Backendless.Async((res:any) => {

            this.data = res.data;

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


    display_datatable() {

        if (!this.state.loading) {

            if (!this.datatable) {
                this.datatable = this.root.find('table').DataTable({
                    columns: [
                        { data: 'compdiv_title', title: 'Division title', width:'40%' },
                        //{ data: 'compdiv_descr', title: 'Description' }
                    ],
                    paging: false,                    
                    lengthChange: false,
                    info : false,
                    data: this.data
                });
            }
            
        }

    }


    init_actions() {

        this.root.find('.btn-addnew').off('click');
        this.root.find('.btn-addnew').click(() => {
            this.props.owner.notify('add-new-division');
        });
    }    
}


export interface CompDivsEditProps extends Views.ReactProps {
    mode: string
}
export class CompDivsEdit extends Views.ReactView {

    props: CompDivsEditProps;
    
    constructor(props: CompDivsEditProps) {
        super(props);
    }


    render() {

        var mode = 'Edit new division';

        if (this.props.mode === 'new') {
            mode = 'Add new division';
        }    
        
        var html =
            <div className="animated fadeInRight">

                <jx.controls.BlackBlox title={mode} icon={<i className="fa fa-edit"></i>} >

                    <b.FormGroup controlId="formControlsText">
                        <jx.controls.BigLabel label="Division title" />
                        <b.FormControl type="text" id="compdiv_title" placeholder="Enter a title" />
                    </b.FormGroup>
                    
                    <b.FormGroup controlId="formControlsText">
                        <jx.controls.BigLabel label="Division description" />                        
                        <textarea rows={3} id="compdiv_descr" className="custom-scroll form-control" />
                    </b.FormGroup>

                    <br />

                    <button className="btn btn-danger pull-right" style={{ marginLeft:10 }}><i className="fa fa-times"></i> Cancel</button>
                    <button className="btn btn-info pull-right btn-save"><i className="fa fa-check"></i> Save</button>

                    <br/>

                </jx.controls.BlackBlox>

            </div>;
            

        return html;
    }


    componentDidMount() {

        this.root.find('.btn-save').click(() => {

            if (this.props.mode === 'new') {

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

        });
    }
}


class CompDiv {
    usrid: string
    compdiv_title: string
}