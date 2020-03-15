require('jsdom');
const neatCsv = require('neat-csv');
const fs = require('fs');

const confirmed$ = getPromise('./time_series_19-covid-Confirmed.csv');
const deaths$ = getPromise('./time_series_19-covid-Deaths.csv');
const recovered$ = getPromise('./time_series_19-covid-Recovered.csv');

Promise.all([confirmed$, deaths$, recovered$]).then(
  ([[time, data_confirmed], [, data_deaths], [, data_recovered]]) => {

    const ChartjsNode = require('chartjs-node');
// 600x600 canvas size
    var chartNode = new ChartjsNode(1200, 600);
    return chartNode.drawChart({
      type: 'line',
      data: {
        labels: time,
        datasets: [{
          label: 'Corona',
          backgroundColor: '#ff0000',
          fill: true,
          data: data_confirmed,
          borderWidth: 1
        }, {
          label: 'Recovered',
          data: data_recovered,
          borderWidth: 1
        }, {
          label: 'Death',
          data: data_deaths,
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        width: 400,
        height: 400,
        animation: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        tooltips: {
          mode: 'label'
        },
      },
    })
      .then(() => {
        // chart is created

        // get image as png buffer
        return chartNode.getImageBuffer('image/png');
      })
      .then(buffer => {
        Array.isArray(buffer) // => true
        // as a stream
        return chartNode.getImageStream('image/png');
      })
      .then(streamResult => {
        // using the length property you can do things like
        // directly upload the image to s3 by using the
        // stream and length properties
        streamResult.stream // => Stream object
        streamResult.length // => Integer length of stream
        // write to a file
        return chartNode.writeImageToFile('image/png', './docs/testimage.png');
      })
      .then(() => {
        // chart is now written to the file path
        // ./testimage.png
      });
  }
);

function getPromise(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile((fileName), async (err, data) => {
      if (err) {
        reject(err);
        console.error(err);
        return
      }
      const foo = await neatCsv(data);

      const bar = foo.filter((line) => line['Country/Region'] === 'Slovakia')[0];

      const time = Object.keys(bar);
      time.splice(0, 47);

      const dat = Object.values(bar);
      dat.splice(0, 47);
      //
      // console.log(time);
      // console.log(dat);
      resolve([time, dat]);
    })
  })
}
