import React from 'react';
import { Group } from '@vx/group';
import { curveBasis } from '@vx/curve';
import { LinePath } from '@vx/shape';
import { Threshold } from '@vx/threshold';
import { scaleTime, scaleLinear } from '@vx/scale';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { GridRows, GridColumns } from '@vx/grid';
import { cityTemperature as data1 } from '@vx/mock-data';
import { timeFormat, timeParse } from 'd3-time-format';
import { transformYearTerm , sortYearTerm , calcGPA } from './lib';

const parseDate = timeParse('%Y%m');

// accessors
const ny = d => {
    return calcGPA(d);
}
const sf = d => {
    if ( 'new' in d){
        var out = calcGPA(d.new);
        return out;
    }else
    return calcGPA(d);
}

export default class Thresholds extends React.Component {
    render() {
        const { width, height, margin, events } = this.props;
        var data = this.props.data.sort( sortYearTerm );
        var data1 = this.props.data1;
        console.log(data1);
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
        console.log(data);
        const date = d => {
            return parseDate(transformYearTerm(d.yearterm));
        };
        if (width < 10 ) return null;

        // bounds
        const xMax = width - margin.left - margin.right;
        const yMax = height - margin.top - margin.bottom;

        // scales
        const xScale = scaleTime({
            range: [0, xMax],
            domain: [Math.min(...data.map(date)), Math.max(...data.map(date))]
        });
        const yScale = scaleLinear({
            range: [yMax, 0],
            domain: [
                Math.min(Math.min(...data.map(d => Math.min(ny(d), sf(d)))),1),
                4
            ],
            nice: true
        });

        return (
            <div>
                <svg width={width} height={height}>
                    <rect x={0} y={0} width={width} height={height} fill="#f3f3f3" rx={14} />
                    <Group left={margin.left} top={margin.top}>
                        <GridRows scale={yScale} width={xMax} height={yMax} stroke="#e0e0e0" />
                        <GridColumns scale={xScale} width={xMax} height={yMax} stroke="#e0e0e0" />
                        <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />
                        <AxisBottom top={yMax} scale={xScale} numTicks={width > 520 ? 10 : 5} />
                        <AxisLeft scale={yScale} />
                        <text x="-25" y="-10" fontSize={10}>
                            GPA
                        </text>
                        <Threshold
                            data={data}
                            x={date}
                            y0={ny}
                            y1={sf}
                            xScale={xScale}
                            yScale={yScale}
                            clipAboveTo={0}
                            clipBelowTo={yMax}
                            curve={curveBasis}
                            belowAreaProps={{
                                fill: 'green',
                                fillOpacity: 0.4
                            }}
                            aboveAreaProps={{
                                fill: 'red',
                                fillOpacity: 0.4
                            }}
                        />
                        <LinePath
                            data={data}
                            x={date}
                            y={sf}
                            xScale={xScale}
                            yScale={yScale}
                            stroke="#000"
                            strokeWidth={1.5}
                            curve={curveBasis}
                            strokeOpacity={0.8}
                            strokeDasharray="1,2"
                        />
                        <LinePath
                            data={data}
                            x={date}
                            y={ny}
                            xScale={xScale}
                            curve={curveBasis}
                            yScale={yScale}
                            stroke="#000"
                            strokeWidth={1.5}
                        />
                    </Group>
                </svg>
            </div>
        );
    }
}
