import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Pie from './Pie';

class App extends Component {
    componentDidMount(){
        var course = ['CS',241];
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
            .then(res => this.processGPA(res,'prof',0))
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    appendTerm(A , B){
        var out = A;
        out['a'] += B['a'];
        out['aminus'] += B['aminus'];
        out['aplus'] += B['aplus'];
        out['b'] += B['b'];
        out['bminus'] += B['bminus'];
        out['bplus'] += B['bplus'];
        out['c'] += B['c'];
        out['cminus'] += B['cminus'];
        out['cplus'] += B['cplus'];
        out['d'] += B['d'];
        out['dminus'] += B['dminus'];
        out['dplus'] += B['dplus'];
        out['f'] += B['f'];

        return out;
    }

    processGPA(input,type,val){
        var output = [];
        if (type === 'semester'){
            output = input.reduce( ( out, i ) => {
                var term = out.filter( yt => yt.yearterm == i.yearterm );

                if (true || i.instructor === "Angrave, Lawrence C"){
                    if (term.length === 0) {
                        out.push(i);
                    }
                    else{
                        out = out.filter( yt => yt.yearterm !== i.yearterm );
                        var data = term[0];
                        out.push(this.appendTerm(data,i));
                    }
                }
                return out;
            }, []);

        }else if (type === 'prof'){
            output = input.reduce( (out, i ) => {
                var prof = out.filter( yt => yt.instructor == i.instructor );

                if (true){
                    if (prof.length === 0) {
                        out.push(i);
                    }
                    else{
                        out = out.filter( yt => yt.instructor !== i.instructor );
                        var data = prof[0];
                        out.push(this.appendTerm(data,i));
                    }
                }
                return out;
            }, []);
        }
        return output;
    }

                render() {
                    return (
                        <div className="App">
                            <header className="App-header">
                                <img src={logo} className="App-logo" alt="logo" />
                                <h1 className="App-title">Welcome to React</h1>
                            </header>
                            <p className="App-intro">
                                To get started, edit <code>src/App.js</code> and save to reload.
                            </p>
                            <Pie />
                        </div>
                    );
                }
        }

            export default App;
