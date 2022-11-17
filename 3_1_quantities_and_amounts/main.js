/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,  
  margin = { top: 50, bottom: 100, left: 60, right: 70 };
  //radius = 10;
let xScale, yScale

/* APPLICATION STATE */
let state = {
  data: [],
};

/* LOAD DATA */
d3.csv('../data/statePopulations.csv', d3.autoType).then(raw_data => {
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  /* SCALES */
  // xscale - categorical, State
  xScale = d3.scaleBand()
    .domain(state.data.map(d=> d.State))
    .range([margin.left, width - margin.right]) // visual variable
    .paddingInner(.2)

  // yscale - linear,Total
  yScale = d3.scaleLinear()
    .domain([0, d3.max(state.data, d=> d["Total Housing Units"])])
    .range([height - margin.bottom, margin.top])
  
  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  /* HTML ELEMENTS */
  // svg
  const xAxis = d3.axisBottom().scale(xScale);
  const yAxis = d3.axisLeft().scale(yScale);


  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#F7F1E9")
    
  
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);
    
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`) // think this needs to be fixed to fix bar problem, but unsure how?
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-90)")
    .style("text-anchor", "end")
    .style("font-size", 10)
    ;
  // bars
  svg.selectAll("rect.bar")
    .data(state.data)
    .join("rect")
    .attr("width", xScale.bandwidth())
    .attr("height", d=> height - yScale(d["Total Housing Units"]))
    .attr("x", d=>xScale(d.State))
    .attr("y", d=> yScale(d["Total Housing Units"]))
    .style("fill", "#69b3a2")
    .style("opacity", 0.5)
  
  
}