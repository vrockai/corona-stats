require('jsdom');

const env = process.env;
const ChartjsNode = require('chartjs-node');
const {drawChart} = require('./chart');
const {getCsvRowPromise} = require('./csv');

const width = env['COR_WIDTH'] || 1200;
const height = env['COR_HEIGHT'] || 800;
const country = env['COR_COUNTRY'] || 'Slovakia';


const confirmed$ = getCsvRowPromise('./time_series_19-covid-Confirmed.csv', country);
const deaths$ = getCsvRowPromise('./time_series_19-covid-Deaths.csv', country);
const recovered$ = getCsvRowPromise('./time_series_19-covid-Recovered.csv', country);

Promise.all([confirmed$, deaths$, recovered$]).then(
  ([[timeAxis, dataConfirmed], [, dataDeaths], [, dataRecovered]]) => {
    const chartNode = new ChartjsNode(width, height);

    drawChart(chartNode, timeAxis, dataConfirmed, dataRecovered, dataDeaths)
      .then(() => chartNode.getImageBuffer('image/png'))
      .then(buffer => chartNode.getImageStream('image/png'))
      .then(streamResult => chartNode.writeImageToFile('image/png', './docs/corona_stats.png'));
  }
);




