(() => {
  const margin = { top: 40, right: 50, bottom: 50, left: 70 },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

  const svg = d3.select("#boxplot-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const dataTypeToggle = document.getElementById("toggle-data-type");

  Promise.all([
    d3.csv("data/MaleTemp.csv", d3.autoType),
    d3.csv("data/FemTemp.csv", d3.autoType),
    d3.csv("data/MaleAct.csv", d3.autoType),
    d3.csv("data/FemAct.csv", d3.autoType)
  ]).then(([maleTemp, femTemp, maleAct, femAct]) => {
    const datasets = {
      temp: {
        male: tidy(maleTemp),
        female: tidy(femTemp)
      },
      act: {
        male: tidy(maleAct),
        female: tidy(femAct)
      }
    };

    function tidy(data) {
      return Object.keys(data[0]).flatMap(key =>
        data.map(row => ({ value: +row[key] }))
      ).filter(d => !isNaN(d.value));
    }

    function drawBoxPlot(type = "temp") {
      const maleData = datasets[type].male.map(d => d.value);
      const femaleData = datasets[type].female.map(d => d.value);

      const allData = [
        { label: "Male", values: maleData },
        { label: "Female", values: femaleData }
      ];

      svg.selectAll("*").remove();

      const x = d3.scaleBand()
        .range([0, width])
        .domain(allData.map(d => d.label))
        .padding(0.6);

      const y = d3.scaleLinear()
        .domain([
          d3.min([...maleData, ...femaleData]) - 2,
          d3.max([...maleData, ...femaleData]) + 2
        ])
        .nice()
        .range([height, 0]);

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg.append("g")
        .call(d3.axisLeft(y));

      svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(`${type === "temp" ? "Temperature" : "Activity"} Distribution by Sex`);

      allData.forEach(group => {
        const sorted = group.values.sort(d3.ascending);
        const q1 = d3.quantile(sorted, 0.25);
        const median = d3.quantile(sorted, 0.5);
        const q3 = d3.quantile(sorted, 0.75);
        const iqr = q3 - q1;
        const min = d3.max([d3.min(sorted), q1 - 1.5 * iqr]);
        const max = d3.min([d3.max(sorted), q3 + 1.5 * iqr]);

        const center = x(group.label) + x.bandwidth() / 2;

        svg.append("line")
          .attr("x1", center).attr("x2", center)
          .attr("y1", y(min)).attr("y2", y(max))
          .attr("stroke", "black");

        svg.append("rect")
          .attr("x", x(group.label))
          .attr("y", y(q3))
          .attr("height", y(q1) - y(q3))
          .attr("width", x.bandwidth())
          .attr("stroke", "black")
          .style("fill", group.label === "Male" ? "#64b5f6" : "#f06292")
          .style("opacity", 0.7);

        svg.append("line")
          .attr("x1", x(group.label)).attr("x2", x(group.label) + x.bandwidth())
          .attr("y1", y(median)).attr("y2", y(median))
          .attr("stroke", "black")
          .style("stroke-width", 2);

        svg.append("line")
          .attr("x1", center - 10).attr("x2", center + 10)
          .attr("y1", y(min)).attr("y2", y(min))
          .attr("stroke", "black");

        svg.append("line")
          .attr("x1", center - 10).attr("x2", center + 10)
          .attr("y1", y(max)).attr("y2", y(max))
          .attr("stroke", "black");

        const outliers = sorted.filter(d => d < min || d > max);
        svg.selectAll(`.outlier-${group.label}`)
          .data(outliers)
          .enter()
          .append("circle")
          .attr("cx", center)
          .attr("cy", d => y(d))
          .attr("r", 3)
          .style("fill", "red")
          .style("opacity", 0.6);
      });
    }

    drawBoxPlot("temp");

    if (dataTypeToggle) {
      dataTypeToggle.addEventListener("change", () => {
        const selected = dataTypeToggle.checked ? "act" : "temp";
        drawBoxPlot(selected);
      });
    }
  }).catch(error => {
    console.error("Error loading data:", error);
  });
})();