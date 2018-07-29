import React, { Component } from 'react';
import logo from '../logo.svg';
import MultiSelectSimple from '../MultiSelectSimple' ;
import './App.css';
import Pie from '../Pie';
import Threshold from '../Threshold';
import { processGPA } from '../lib';
import { transformYearTerm , sortYearTerm , calcGPA } from '../lib';

class App extends Component {
    constructor(props){
        super(props);
        this.search = this.search.bind(this);
        this.changedMulti = this.changedMulti.bind(this);
        this.state = {'data':[], d:[],d1:[],ori:[],prompt: "Enter a course number: "};
    }
    changedMulti(e){
        var d1 = processGPA(this.state.data,'semester', e);
        this.setState({"d1":d1,d:[]});

        var data = processGPA(this.state.data,'semester', null).sort( sortYearTerm );
        var data1 = d1;
        var data2 = data1.map(d => {
            return d.yearterm;
        });
        console.log(this.state.data);
        data = data.map( d => {
            if (data2.includes(d.yearterm)){
                d['new'] = data1[data2.indexOf(d.yearterm)];
                return d;
            }
            return d;
        });

        this.setState({d:data});


    }
    search(e){
        if(e.key == 'Enter'){
            var query = document.getElementById('inputSearch').value;
            var course = query.match(/([A-Za-z]+)([0-9]+)/);
            if(course == null){
                this.setState({'prompt': "No results found, Please make sure you entered a correct course and try again!"});
                return;
            }
            fetch('https://0-web-api.course-ly.com/api/'+'getGPA',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Requested-With': 'Course-ly-web'
                },
                body: JSON.stringify({
                    dept: course[1],
                    num: course[2]
                })
            })
                .then(res => {
                    var contentType = res.headers.get("content-type");
                    if (res.status !== 200 || !contentType || !contentType.includes("application/json")) {
                        throw new TypeError("failed to get data.");
                    }
                    return res.json();
                })
                .then(res => {
                    this.setState({'data':res})
                    this.setState({'prompt': "Successfully fetched data. The results are shown in the Charts below."});
                    this.changedMulti(res[0].instructor);
                })
                .catch(err => console.log(err));
        }
    }

    render() {
        return (
            <div className="main-content container-fluid" style={{width:'1360px'}}>
                <div className="App">
                    <header className="App-header">
                        <h1 className="App-title">Course Statistics Visualization</h1>
                    </header>
                    <div className="form-group pt-2">
                        <label htmlFor="inputSearch">{this.state.prompt}</label>
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
                                        <MultiSelectSimple changedMulti={this.changedMulti} list={[...new Set(this.state.data.map(d=>d.instructor))]}  style={{textAlign: 'right', marginLeft: 'auto'}}></MultiSelectSimple>
                                    </div>
                                </div>
                                <div className="widget-chart-container">
                                    <Pie
                                        width={600}
                                        height={400}
                                        margin = {{
                                            top: 10,
                                            left: 20,
                                            right: 20,
                                            bottom: 10,
                                        }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="widget widget-tile">
                                        <div className="widget-head">
                                            <div className="row">
                                                <div className="title" style={{textAlign: 'left', paddingLeft:'20px'}}>Put Chart2 Name Here</div>
                                                <div className="text" style={{textAlign: 'right',  marginLeft: 'auto', paddingRight:'30px',paddingTop:'5px'}}>{"Terms: "+this.state.d1.map(d=>d.yearterm + " ")}</div>
                                            </div>
                                        </div>
                                        <div className="widget-chart-container">
                                            <Threshold height={400} width={600} margin={{'top':25,'bottom':40,'left':40,'right':15}} data={this.state.d} />
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
