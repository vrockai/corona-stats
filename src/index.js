require('jsdom');

const env = process.env;
const ChartjsNode = require('chartjs-node');
const {drawChart, drawChart2} = require('./chart');
const {getCsvRowPromise} = require('./csv');

const width = env['COR_WIDTH'] || 1200;
const height = env['COR_HEIGHT'] || 600;
const country = env['COR_COUNTRY'] || 'Slovakia';

const confirmed$ = getCsvRowPromise('./time_series_19-covid-Confirmed.csv', country);
const deaths$ = getCsvRowPromise('./time_series_19-covid-Deaths.csv', country);
const recovered$ = getCsvRowPromise('./time_series_19-covid-Recovered.csv', country);

const population = {
  'Slovakia': 5441899,
  'Czechia': 10649800,
};

Promise.all([confirmed$, deaths$, recovered$]).then(
  ([[timeAxis, dataConfirmed], [, dataDeaths], [, dataRecovered]]) => {
    const chartNode = new ChartjsNode(width, height);

    drawChart(chartNode, timeAxis, dataConfirmed, dataRecovered, dataDeaths)
      .then(() => chartNode.getImageBuffer('image/png'))
      .then(buffer => chartNode.getImageStream('image/png'))
      .then(streamResult => chartNode.writeImageToFile('image/png', './docs/corona_stats.png'));
  }
);

const country1 = 'Slovakia';
const country2 = 'Czechia';

const confirmed1$ = getCsvRowPromise('./time_series_19-covid-Confirmed.csv', country1);
const confirmed2$ = getCsvRowPromise('./time_series_19-covid-Confirmed.csv', country2);

Promise.all([confirmed1$, confirmed2$]).then(
  ([[timeAxis, dataConfirmed1], [, dataConfirmed2]]) => {
      const chartNode = new ChartjsNode(width, height);

      const perPerson1 = n => n / population[country1];
      const dataConfirmedPp1 = dataConfirmed1.map(perPerson1);

      const perPerson2 = n => n / population[country2];
      const dataConfirmedPp2 = dataConfirmed2.map(perPerson2);

      drawChart2(chartNode, timeAxis, country1, dataConfirmedPp1, country2, dataConfirmedPp2)
        .then(() => chartNode.getImageBuffer('image/png'))
        .then(buffer => chartNode.getImageStream('image/png'))
        .then(streamResult => chartNode.writeImageToFile('image/png', './docs/corona_stats_compare.png'));
  }
);