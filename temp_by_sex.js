// tempBySexChart.js
(async () => {
  // Load CSV data
  const femaleTemp = await d3.csv("data/FemTemp.csv");
  const maleTemp = await d3.csv("data/MaleTemp.csv");

  // Calculate average temperature per mouse for each sex
  const femaleTemps = femaleTemp.columns.map(col => d3.mean(femaleTemp, d => +d[col]));
  const femaleAvg = d3.mean(femaleTemps);

  const maleTemps = maleTemp.columns.map(col => d3.mean(maleTemp, d => +d[col]));
  const maleAvg = d3.mean(maleTemps);

  const data = [
    { sex: "Female", temp: femaleAvg },
    { sex: "Male", temp: maleAvg }
  ];

  // Setup SVG dimensions and margins
  const margin = { top: 40, right: 30, bottom: 60, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#temp-by-sex-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("font-family", "'Roboto', sans-serif")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Scales
  const x = d3.scaleBand()
    .domain(data.map(d => d.sex))
    .range([0, width])
    .padding(0.4);

  const y = d3.scaleLinear()
    .domain([d3.min(data, d => d.temp) - 0.2, d3.max(data, d => d.temp) + 0.2])
    .range([height, 0]);

  // Color map
  const colorMap = { "Female": "#f06292", "Male": "#64b5f6" };

  // Bars
  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.sex))
    .attr("y", d => y(d.temp))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.temp))
    .attr("fill", d => colorMap[d.sex]);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .style("font-size", "16px");

  svg.append("g")
    .call(d3.axisLeft(y).ticks(5))
    .style("font-size", "16px");

  // Axis Labels
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 50)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Mouse Sex");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -45)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Average Temperature (°C)");

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .style("font-weight", "bold")
    .text("Average Mouse Body Temperature by Sex");
})();
