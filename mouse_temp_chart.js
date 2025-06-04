(() => {
  const container = d3.select("#mouse-temp-chart");

  // Much larger canvas and margins
  const margin = { top: 120, right: 100, bottom: 200, left: 120 };
  const width = 1000 - margin.left - margin.right;
  const height = 550 - margin.top - margin.bottom;

  const svg = container.append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%")
    .style("height", "auto")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  Promise.all([
    d3.csv("data/FemTemp.csv"),
    d3.csv("data/MaleTemp.csv")
  ]).then(([femData, maleData]) => {
    const femaleAvg = Object.entries(femData.columns.reduce((acc, col) => {
      acc[col] = d3.mean(femData, d => +d[col]);
      return acc;
    }, {})).map(([id, val], i) => ({ id: `f${i + 1}`, temp: val, sex: "Female" }));

    const maleAvg = Object.entries(maleData.columns.reduce((acc, col) => {
      acc[col] = d3.mean(maleData, d => +d[col]);
      return acc;
    }, {})).map(([id, val], i) => ({ id: `m${i + 1}`, temp: val, sex: "Male" }));

    const data = femaleAvg.concat(maleAvg);
    const overallAvg = d3.mean(data, d => d.temp);

    const x = d3.scaleBand()
      .domain(data.map(d => d.id))
      .range([0, width])
      .padding(0.25);

    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.temp) - 0.5, d3.max(data, d => d.temp) + 0.5])
      .range([height, 0]);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "#222")
      .style("padding", "10px")
      .style("border-radius", "6px")
      .style("pointer-events", "none")
      .style("font-size", "18px");

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.id))
      .attr("y", d => y(d.temp))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.temp))
      .attr("fill", d => d.sex === "Female" ? "salmon" : "steelblue")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`${d.id}: ${d.temp.toFixed(2)}ºC`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 40) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Chart Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -60)
      .attr("text-anchor", "middle")
      .style("font-size", "40px")
      .style("font-weight", "bold")
      .text("Average Body Temperature per Mouse by Sex");

    // X-axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end")
      .style("font-size", "22px");

    // X-axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 160)
      .attr("text-anchor", "middle")
      .style("font-size", "26px")
      .text("Mouse ID");

    // Y-axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(12))
      .selectAll("text")
      .style("font-size", "20px");

    // Y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -80)
      .attr("text-anchor", "middle")
      .style("font-size", "26px")
      .text("Average Temperature (ºC)");

    // Average Line
    svg.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", y(overallAvg))
      .attr("y2", y(overallAvg))
      .attr("stroke", "black")
      .attr("stroke-dasharray", "6 6")
      .attr("stroke-width", 4);

    // Average Label
    svg.append("text")
      .attr("x", width - 20)
      .attr("y", y(overallAvg) - 15)
      .attr("text-anchor", "end")
      .style("fill", "black")
      .style("font-size", "22px")
      .style("font-weight", "bold")
      .text(`Overall Avg: ${overallAvg.toFixed(2)}ºC`);

    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 250}, 0)`);

    legend.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 30)
      .attr("height", 30)
      .attr("fill", "salmon");

    legend.append("text")
      .attr("x", 40)
      .attr("y", 22)
      .text("Female")
      .style("font-size", "22px");

    legend.append("rect")
      .attr("x", 0)
      .attr("y", 40)
      .attr("width", 30)
      .attr("height", 30)
      .attr("fill", "steelblue");

    legend.append("text")
      .attr("x", 40)
      .attr("y", 62)
      .text("Male")
      .style("font-size", "22px");
  });
})();
