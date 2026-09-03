import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

const generateMockHeatmapData = () => {
  const data: { day: string; time: string; density: number }[] = [];
  days.forEach((day) => {
    timeSlots.forEach((time) => {
      let density = Math.floor(Math.random() * 30); 
      const hour = parseInt(time.split(':')[0]);
      
      if (day === 'Sat' || day === 'Sun') {
        density += 40;
        if (hour >= 18) density += 30;
      } else {
        if (hour >= 18) density += 40;
        if (hour >= 12 && hour <= 14) density += 20;
      }
      
      data.push({
        day,
        time,
        density: Math.min(density, 100),
      });
    });
  });
  return data;
};

const heatmapData = generateMockHeatmapData();

export default function WeeklyDensityHeatmap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(timeSlots)
      .padding(0.05);

    svg.append("g")
      .style("font-size", "11px")
      .style("color", "#64748b")
      .style("font-weight", "600")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0).tickPadding(8))
      .select(".domain").remove();

    const y = d3.scaleBand()
      .range([0, height])
      .domain(days)
      .padding(0.05);

    svg.append("g")
      .style("font-size", "11px")
      .style("color", "#64748b")
      .style("font-weight", "600")
      .call(d3.axisLeft(y).tickSize(0).tickPadding(8))
      .select(".domain").remove();

    const myColor = d3.scaleSequential()
      .interpolator(d3.interpolateOranges)
      .domain([0, 100]);

    const tooltip = d3.select(containerRef.current)
      .append("div")
      .style("opacity", 0)
      .attr("class", "absolute bg-slate-900 text-white text-xs p-2 rounded pointer-events-none z-10 transition-opacity shadow-lg");

    svg.selectAll()
      .data(heatmapData, function(d: any) { return d.day + ':' + d.time; })
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.time) || 0; })
      .attr("y", function(d) { return y(d.day) || 0; })
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function(d) { return myColor(d.density); })
      .style("stroke-width", 2)
      .style("stroke", "white")
      .on("mouseover", function(event, d) {
        tooltip.style("opacity", 1);
        d3.select(this)
          .style("stroke", "#f97316")
          .style("stroke-width", 2);
      })
      .on("mousemove", function(event, d) {
        const containerRect = containerRef.current!.getBoundingClientRect();
        tooltip
          .html(`<strong>${d.day}</strong> at ${d.time}<br/>Density: ${d.density}%`)
          .style("left", (event.clientX - containerRect.left + 15) + "px")
          .style("top", (event.clientY - containerRect.top - 15) + "px");
      })
      .on("mouseleave", function() {
        tooltip.style("opacity", 0);
        d3.select(this)
          .style("stroke", "white")
          .style("stroke-width", 2);
      });
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <svg ref={svgRef}></svg>
    </div>
  );
}
