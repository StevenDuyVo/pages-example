// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const sampleArray = metadata.filter(sampleNumber => sampleNumber.id == sample);
    const choice = sampleArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let i = 0; i < metadata.length; i++) {
      const key = Object.keys(choice)[i];
      const value = Object.values(choice)[i];
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const objectArray = samples.filter(sampleObject => sampleObject.id == sample);
    const sampleObject = objectArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = sampleObject.otu_ids;
    const otu_labels = sampleObject.otu_labels;
    const sample_values = sampleObject.sample_values;

    // Build a Bubble Chart
    const bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
      }
    }];

    const bubbleDesign = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      margin: { t: 30, l: 150 }
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleDesign);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barData = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    const barChart = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {
        title: "Number of Bacteria",
        tickmode: 'linear',
        tick0: 0,
        dtick: 20  
      },
      margin: { t: 30, l: 150 }
    };


    // Render the Bar Chart
    Plotly.newPlot("bar", barChart, barDesign);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < sampleNames.length; i++) {
      const sample = sampleNames[i];
      selector.append("option")
          .text(sample)
          .property("value", sample);
    }

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
