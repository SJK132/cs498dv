/*
 * Created on Thu Jun 27 2018
 *
 * @author Hetian Huo
 * Copyright (c) 2018 Coursely
 */
import React, { Component } from 'react';

export default class MultiSelectSimple extends Component {

    constructor (props) {
        super(props);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.state = {
            value : ""
        }
    }

    onChangeHandler(event){
        this.props.changedMulti(this.props.disc , event.target.value);
        this.setState({value:event.target.value});
    }

    render() {
        return(
            <div className="form-group row pt-1">
                <label className="col-12 col-sm-3 col-form-label text-sm-right">
                    {this.props.disc}
                </label>
                <div className="col-12 col-sm-8 col-lg-6">
                    <select value={this.state.value}
                        style={{"height":"3rem"}}
                        className={"form-control " +this.props.invalid}
                        onChange={this.onChangeHandler}
                        disabled={this.props.list.length === 0}>
                        {
                            this.props.list.length === 0 &&
                            <option disabled value="">
                                {this.props.disable?"-- Select a Semester --":"    Loading ...."}
                            </option>
                        }
                        {
                            this.props.list.map( (val,i) => {
                                return (
                                    <option key={i} value={i}>{val}</option>
                                )
                            })

                        }
                        }
                    </select>
                </div>
            </div>
        );
}
}

