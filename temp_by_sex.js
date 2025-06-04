(async () => {
  const femaleTemp = await d3.csv("data/FemTemp.csv");
  const maleTemp = await d3.csv("data/MaleTemp.csv");

  const femaleTemps = femaleTemp.columns.map(col => d3.mean(femaleTemp, d => +d[col]));
  const femaleAvg = d3.mean(femaleTemps);

  const maleTemps = maleTemp.columns.map(col => d3.mean(maleTemp, d => +d[col]));
  const maleAvg = d3.mean(maleTemps);

  const data = [
    { sex: "Female", temp: femaleAvg },
    { sex: "Male", temp: maleAvg }
  ];

  const margin = { top: 100, right: 40, bottom: 100, left: 80 },
        width = 900,
        height = 600;

  const svg = d3.select("#temp-by-sex-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("font-family", "'Inter', 'Roboto', sans-serif")
    .style("width", "100%")
    .style("height", "auto")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.sex))
    .range([0, width])
    .padding(0.4);

  const yMin = d3.min(data, d => d.temp) - 0.05;
  const yMax = d3.max(data, d => d.temp) + 0.05;
  const y = d3.scaleLinear().domain([yMin, yMax]).nice().range([height, 0]);

  const colorMap = { Female: "#f06292", Male: "#64b5f6" };

  const tooltip = d3.select("#temp-by-sex-chart")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("padding", "12px 16px")
    .style("background", "#222")
    .style("color", "#fff")
    .style("border-radius", "8px")
    .style("font-size", "16px")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("z-index", 10);

  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.sex))
    .attr("y", d => y(d.temp))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.temp))
    .attr("fill", d => colorMap[d.sex])
    .on("mouseenter", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.95);
      tooltip.html(`<strong>${d.sex}</strong><br>Avg Temp: ${d.temp.toFixed(2)}°C`);
      d3.select(this).attr("fill", d3.rgb(colorMap[d.sex]).darker(0.7));
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", `${event.pageX + 12}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseleave", function (event, d) {
      tooltip.transition().duration(300).style("opacity", 0);
      d3.select(this).attr("fill", colorMap[d.sex]);
    });

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size", "20px");

  svg.append("g")
    .call(d3.axisLeft(y).ticks(6))
    .selectAll("text")
    .style("font-size", "20px");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 70)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Mouse Sex");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -60)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Avg Temperature (°C)");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .style("font-size", "30px")
    .style("font-weight", "600")
    .text("Average Mouse Body Temperature by Sex");
})();
