import React from 'react';
import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { GradientTealBlue } from '@vx/gradient';
import { letterFrequency, browserUsage } from '@vx/mock-data';

console.log(letterFrequency);
const letters = letterFrequency.slice(0, 4);
const browsers = Object.keys(browserUsage[0])
  .filter(k => k !== "date")
  .map(k => ({ label: k, usage: browserUsage[0][k] }));

function Label({ x, y, children }) {
  return (
    <text
      fill="white"
      textAnchor="middle"
      x={x}
      y={y}
      dy=".33em"
      fontSize={9}
    >
      {children}
    </text>
  );
}

export default ({
  width=675,
  height=400,
  events = false,
  margin = {
    top: 40,
    left: 20,
    right: 20,
    bottom: 40,
  }
}) => {
  if (width < 10) return null;
  const radius = Math.min(width, height) / 2;
  return (
    <svg width={width} height={height}>
      <GradientTealBlue id="TealBlue" />
      <rect
        x={0}
        y={0}
        rx={14}
        width={width}
        height={height}
        fill="url('#TealBlue')"
      />
      <Group top={height / 2 - margin.top} left={width / 2}>
        <Pie
          data={browsers}
          pieValue={d => d.usage}
          outerRadius={radius - 80}
          innerRadius={radius - 120}
          fill="white"
          fillOpacity={d => 1 / (d.index + 2) }
          cornerRadius={3}
          padAngle={0}
          centroid={(centroid, arc) => {
            const [x, y] = centroid;
            const { startAngle, endAngle } = arc;
            if (endAngle - startAngle < .1) return null;
            return <Label x={x} y={y}>{arc.data.label}</Label>;
          }}
        />
        <Pie
          data={letters}
          pieValue={d => d.frequency}
          outerRadius={radius - 135}
          fill="black"
          fillOpacity={d => 1 / (d.index + 2) }
          centroid={(centroid, arc) => {
            const [x, y] = centroid;
            return <Label x={x} y={y}>{arc.data.letter}</Label>;
          }}
        />
      </Group>
    </svg>
  );
}

