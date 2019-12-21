
// Fetch the JSON data and console log it
function datadumpandgraph(sample_name) {
    d3.json("samples.json").then((data)=> {

        console.log(data)
        
        // create variables for samples and metadata
        var ds =data.samples
        var dm =data.metadata

        // filter samples based on selected name and console.log all samples and filtered sample
        var filteredData = ds.filter(sample => sample.id === sample_name);
        console.log(sample_name)
        console.log(ds)
        console.log(filteredData)

        // use results variable to make filteredData accessible to create variables for each
        var results=filteredData[0];
        console.log(results)
        
        // filter metadata based on selected name and console.log all metadata and filtered metadata
        
        var filteredMeta = dm.filter(meta => meta.id == sample_name);

        console.log(dm)
        console.log(filteredMeta)

        var resultsMeta=filteredMeta[0];
        console.log(resultsMeta)

        // create variables for each of the items in the filtered data to be used in plotting graphs
        var sample_values=results.sample_values
        var otu_ids=results.otu_ids
        var otu_labels=results.otu_labels
        var yticks= otu_ids.slice(0,10).reverse
        // var otu_labels_bar=[otu_labels[9],otu_labels[8],otu_labels[7],otu_labels[6],otu_labels[5],otu_labels[4],otu_labels[3],otu_labels[2],otu_labels[1],otu_labels[0]]
        var otu_ids_bar=["otu" + otu_ids[9], "otu" + otu_ids[8], "otu"+otu_ids[7], "otu"+otu_ids[6], "otu"+otu_ids[5], "otu"+otu_ids[4],"otu"+otu_ids[3],"otu"+otu_ids[2], "otu"+otu_ids[1],"otu"+ otu_ids[0]]
        // var sample_values_bar=[sample_values[9], sample_values[8], sample_values[7], sample_values[6], sample_values[5], sample_values[4], sample_values[3], sample_values[2], sample_values[1], sample_values[0]]
        
        // create bar graph
        var trace1 = {
            y: otu_ids_bar,
            x:sample_values.slice(0,10).reverse(),
            hovertext:otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation:"h"
        };
    
        var bar_data=[trace1];
        var bar_layout={
            title:"Navel-Gazing",
            xaxis:{title:"Sample Values"},
        };

        Plotly.newPlot("bar",bar_data,bar_layout)

        // create bubble graph
        var trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
              size: sample_values,
              color: otu_ids
            }
        };
          
        var bubble_data = [trace2];
          
        var bubble_layout = {
            title: 'Buggy Bubbles',
            yaxis: {title: "Sample Values"},
            xaxis: {title: "OTUs"},
            showlegend: false,
            height: 700,
            width: 1000
        };
          
        Plotly.newPlot('bubble', bubble_data, bubble_layout);

        // place metadata in the Demographic info chart
        var PANEL=d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(resultsMeta).forEach(([key,value]) =>{
        
            var textToShow=`${key.toUpperCase()}: ${value}`;
            console.log(textToShow);
            PANEL.append("h6").text(textToShow);
        })


        // create gauge for handwashing

        var gaugedata = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: resultsMeta.wfreq,
                title: { text: "Belly-Button Washing Frequency (scrubs per week)" },
                type: "indicator",
                mode: "gauge+number",
                gauge: { axis: { range: [null, 9] } }
            }
        ];
        
        var gaugelayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        
        Plotly.newPlot('gauge', gaugedata, gaugelayout);
    })
}


// create function to initalize the screen
function init() 
{
    console.log("Initializing Screen");

    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => 
    {
        var sampleNames=data.names;
        console.log(sampleNames);

        sampleNames.forEach((sample)=> 
        {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        var initial_sample=data.names[0];
        datadumpandgraph(initial_sample)
    });
}

// create function to launch main function when selection dropdown changes
function optionChanged(sample_name) {

    console.log("Selector changed to sample name: ", sample_name)
    datadumpandgraph(sample_name)
}

// launch init function
init();