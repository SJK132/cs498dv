import React, { Component } from 'react';
import logo from '../logo.svg';
import MultiSelectSimple from '../MultiSelectSimple' ;
import './App.css';
import Pie from '../Pie';
import Threshold from '../Threshold';
import { processGPA } from '../lib';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {'data':[], query: ""};
    }
    componentDidMount(){
        var course = ['MATH',241];
        fetch('https://0-web-api.course-ly.com/api/'+'getGPA',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Requested-With': 'Course-ly-web'
            },
            body: JSON.stringify({
                dept: course[0],
                num: course[1]
            })
        })
            .then(res => {
                var contentType = res.headers.get("content-type");
                if (res.status !== 200 || !contentType || !contentType.includes("application/json")) {
                    throw new TypeError("failed to get data.");
                }
                return res.json();
            })
            .then(res => this.setState({'data':res}))
            .catch(err => console.log(err));
    }

    search(e){
        if(e.key == 'Enter'){
            this.setState({
                query: document.getElementById('inputSearch').value
            });
        }
    }

    render() {
        var data =processGPA(this.state.data,'semester', null);
        var data1 =processGPA(this.state.data,'semester', 1);
        return (
            <div className="main-content container-fluid" style={{width:'1360px'}}>
                <div className="App">
                    <header className="App-header">
                        <h1 className="App-title">Course Statistics Visualization</h1>
                    </header>
                    <div className="form-group pt-2">
                        <label htmlFor="inputSearch">Enter a course number: </label>
                        <div className="input-group input-search">
                            <input id="inputSearch" type="text"
                                placeholder="Please enter a course to start searching <3"
                                className="form-control" onKeyPress={this.search}/>
                            <span className="input-group-btn"></span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-lg-6">
                            <div className="widget widget-tile">
                                <div className="widget-head">
                                    <div className="row">
                                        <div className="title" style={{textAlign: 'left', marginRight: 'auto', paddingLeft:'20px'}}>Put Chart1 Name Here</div>
                                        <MultiSelectSimple list={data.map(d=>d.instructor)}  style={{textAlign: 'right', marginLeft: 'auto'}}></MultiSelectSimple>
                                    </div>
                                </div>
                                <div className="widget-chart-container">
                                    <Pie />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6">
                            <div className="widget widget-tile">
                                <div className="widget-head">
                                    <div className="row">
                                        <div className="title" style={{textAlign: 'left', paddingLeft:'20px'}}>Put Chart2 Name Here</div>
                                        <div className="text" style={{textAlign: 'right',  marginLeft: 'auto', paddingRight:'20px',paddingTop:'5px'}}>{"Terms: "+data1.map(d=>d.yearterm + " ")}</div>
                                    </div>
                                </div>
                                <div className="widget-chart-container">
                                    <Threshold height={400} width={600} data={data} data1={data1} margin={{'top':25,'bottom':40,'left':40,'right':15}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default App;
