import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const halls = ['Crystal Ballroom', 'Garden Lawn', 'Ruby Suite'];
const hours = Array.from({ length: 14 }, (_, i) => `${(i + 9).toString().padStart(2, '0')}:00`);

// Generate mock data for the heatmap
const generateMockHeatmapData = () => {
  const data: { hall: string; hour: string; density: number }[] = [];
  halls.forEach((hall) => {
    hours.forEach((hour) => {
      // Create some realistic-looking pattern
      let density = Math.floor(Math.random() * 40); // Base low usage
      
      const hourNum = parseInt(hour.split(':')[0]);
      if (hall === 'Crystal Ballroom' && hourNum >= 18) density += 50; // Evening events
      if (hall === 'Garden Lawn' && (hourNum >= 16 && hourNum <= 20)) density += 60; // Afternoon/Evening
      if (hall === 'Ruby Suite' && (hourNum >= 10 && hourNum <= 15)) density += 50; // Day seminars
      
      data.push({
        hall,
        hour,
        density: Math.min(density, 100),
      });
    });
  });
  return data;
};

const heatmapData = generateMockHeatmapData();

export default function HallUtilizationHeatmap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const margin = { top: 30, right: 30, bottom: 30, left: 100 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    // Clear any previous SVG content (for re-renders)
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Build X scales and axis
    const x = d3.scaleBand()
      .range([0, width])
      .domain(hours)
      .padding(0.05);

    svg.append("g")
      .style("font-size", "10px")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .select(".domain").remove();

    // Build Y scales and axis
    const y = d3.scaleBand()
      .range([height, 0])
      .domain(halls)
      .padding(0.05);

    svg.append("g")
      .style("font-size", "11px")
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain").remove();

    // Build color scale
    const myColor = d3.scaleSequential()
      .interpolator(d3.interpolateBlues)
      .domain([0, 100]);

    // Add a tooltip
    const tooltip = d3.select(containerRef.current)
      .append("div")
      .style("opacity", 0)
      .attr("class", "absolute bg-slate-900 text-white text-xs p-2 rounded pointer-events-none z-10 transition-opacity");

    // Add rectangles
    svg.selectAll()
      .data(heatmapData, function(d: any) { return d.hall + ':' + d.hour; })
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.hour) || 0; })
      .attr("y", function(d) { return y(d.hall) || 0; })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function(d) { return myColor(d.density); })
      .style("stroke-width", 1)
      .style("stroke", "white")
      .on("mouseover", function(event, d) {
        tooltip.style("opacity", 1);
        d3.select(this)
          .style("stroke", "#1e293b")
          .style("stroke-width", 2);
      })
      .on("mousemove", function(event, d) {
        // Calculate position relative to container
        const containerRect = containerRef.current!.getBoundingClientRect();
        tooltip
          .html(`<strong>${d.hall}</strong><br/>Time: ${d.hour}<br/>Utilization: ${d.density}%`)
          .style("left", (event.clientX - containerRect.left + 10) + "px")
          .style("top", (event.clientY - containerRect.top - 10) + "px");
      })
      .on("mouseleave", function() {
        tooltip.style("opacity", 0);
        d3.select(this)
          .style("stroke", "white")
          .style("stroke-width", 1);
      });

  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <svg ref={svgRef}></svg>
    </div>
  );
}
