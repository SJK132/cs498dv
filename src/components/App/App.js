import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';
import Pie from '../Pie';
import Threshold from '../Threshold';
import { processGPA } from '../lib';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {'data':[]};
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


    render() {
        var data =processGPA(this.state.data,'semester', null);
        var data1 =processGPA(this.state.data,'semester', 1);
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <Pie />
                <Threshold height={400} width={1000} data={data} data1={data1} margin={{'top':20,'bottom':50,'left':50,'right':10}}/>
            </div>
        );
    }
}

export default App;
