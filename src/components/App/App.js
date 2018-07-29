import React, { Component } from 'react';
import logo from '../logo.svg';
import MultiSelectSimple from '../MultiSelectSimple' ;
import './App.css';
import Pie from '../Pie';
import Threshold from '../Threshold';
import { processGPA } from '../lib';
import { transformYearTerm , sortYearTerm ,sortByProf , calcGPA } from '../lib';

class App extends Component {
    constructor(props){
        super(props);
        this.search = this.search.bind(this);
        this.changedMulti = this.changedMulti.bind(this);
        this.state = {'data':[], d:[],d1:[],d2:[],d3:[],prompt: "Enter a course number and hit Enter on the keyboard: "};
    }
    changedMulti(e){
        var d1 = processGPA(this.state.data,'semester', e);
        this.setState({"d1":d1});

        var data = processGPA(this.state.data,'semester', null).sort( sortYearTerm );
        var data1 = d1;
        var data2 = data1.map(d => {
            return d.yearterm;
        });
        data = data.map( d => {
            if (data2.includes(d.yearterm)){
                d['new'] = data1[data2.indexOf(d.yearterm)];
                return d;
            }
            return d;
        });


        var data3 = processGPA( this.state.data,'prof',null).sort( sortByProf );

        data3 = data3.slice(0, Math.min(5,data3.length));
        data3.push({instructor:'etc..',b:data3[0].b/8});

        var reduceGPA = d1.reduce( (out, i) =>{
            out[0].v += i.a;
            out[0].v += i.aplus;
            out[0].v += i.aminus;
            out[1].v += i.b;
            out[1].v += i.bplus;
            out[1].v += i.bminus;
            out[2].v += i.c;
            out[2].v += i.cplus;
            out[2].v += i.cminus;
            out[3].v += i.d;
            out[3].v += i.dplus;
            out[3].v += i.dminus;
            out[4].v += i.f;
            return out;
        }, [{'n':'A','v':0},{'n':'B','v':0},{'n':'C','v':0},{'n':'D','v':0},{'n':'F','v':0}]);

        this.setState({d:data,d2:data3,d3:reduceGPA});


    }
    search(e){
        if(e.key == 'Enter'){
            var query = document.getElementById('inputSearch').value;
            var course = query.match(/([A-Za-z]+)([0-9]+)/);
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
                    if (res.length === 0) {
                        this.setState({'prompt': "Failed to get data, input correct course and try again. (eg. MATH241)"});
                        throw TypeError('failed to get data');
                    }
                    return res;
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
                                        <div className="title" style={{textAlign: 'left', marginRight: 'auto', paddingLeft:'20px'}}>Popular Prof. and Grade</div>
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
                                        }}
                                        data={this.state.d2}
                                        gpad={this.state.d3}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6">
                            <div className="widget widget-tile">
                                <div className="widget-head">
                                    <div className="row">
                                        <div className="title" style={{textAlign: 'left', paddingLeft:'20px'}}>Prof. GPA difference</div>
                                        <div className="text" style={{textAlign: 'right',  marginLeft: 'auto', paddingRight:'30px',paddingTop:'5px'}}>{"Terms: "+this.state.d1.map(d=>d.yearterm + " ")}</div>
                                    </div>
                                </div>
                                <div className="widget-chart-container">
                                    <Threshold height={400} width={600} margin={{'top':25,'bottom':40,'left':40,'right':15}} data={this.state.d} />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-12">
                            <div className="row tab-content" style={{margin:0}}>
                                <div className='tab-pane active'>
                                    <h3>About this Visualization</h3>
                                    <p> This data Visualization uses <strong>Drill Down </strong>approach to display the difference in GPA at UIUC between professors
                                        across the most recent seven semesters (Fall 2010 ~ Fall 2017). Since each class have many information to display,
                                        the best way to lead the reader in this case is Drill Down. The Drill-Down Story visualization structure allows users
                                        to choose a detail instance among all instances provided in the main theme to reveal additional information.
                                        This approach is more reader-driven comparing to the other two structure, Martini Glass and Interactive Slide-show,
                                        yet the Drill-Down still equires lots of author pre-determined possible paths for better user interaction,
                                        such as what candidate elements to include, and what details to include for each elements.
                                        This project relies heavily on data processing and trigger design. The search bar plays a significant role in this
                                        visualization as it allows users to narrow the data down into specific courses. The search bar first triggers the contents
                                        in the pie chart which shows a default professor's statistics. Among all the professors who taught that course in the past,
                                        users can further switch the dropdown button in order to check different professor's statistics,
                                        which leads to another trigger on the line chart.
                                    </p>
                                    <p> Some of the more interesting class to look at are MATH221,231,241,415 ECON102,103. As those classes typically have more than 1 professor
                                        teaching each semester. It is easier to see who is got the better gpa. I choose this project to visualize because I was looking up data about professor's gpa
                                        for my Chem232 Summer class. After some research I decided to drop that class. You may use this tool to see which professor I had. It is a dead give away.
                                    </p>

                                        <p>
                                            <h5>Data Source</h5>
                                            <a href="https://github.com/wadefagen/datasets/tree/master/gpa">https://github.com/wadefagen/datasets/tree/master/gpa</a>
                                            <h5>Source Code</h5>
                                            <a href='https://github.com/SJK132/cs498dv/tree/master'> this </a>

                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="row tab-content" style={{marginLeft:'auto'}}>
                                    <div className='tab-pane active'>
                                        <h4>Scences</h4>
                                        <p> Only have one scence, so the user won't get lost. The scence contains two charts and one search bar. The Chart can provided detiled information based user's query.</p>
                                        <h4>Annotations</h4>
                                        <p> On the right side the professor's taught semester will be displayed. On the left side there is the most Popular professor on Pie chart.
                                        The average course gpa is always display in bold line, and the individual prof. will have dashed line that come off the main line to see the difference.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="row tab-content" style={{marginRight:'auto'}}>
                                    <div className='tab-pane active'>
                                        <h4>Parameters</h4>
                                        <p> The main parameter is the average GPA on the right side. This professor's gpa will be highlighted with green and red color to indicate differences.
                                         There are also break downs for each section.</p>
                                        <h4>Trigger</h4>
                                        <p>The more interesting part of this project. The Search bar and dropdown are the two most important part of the input for the trigger. The two chart are used to diaplay
                                        the result based on the input. Behind the scence actions are sorting, filtering, reducing. Combining these step will yield the final output.
                                        </p>
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
