const env = process.env;

const labelCases = env['COR_LABEL_CASES'] || 'Pripadov';
const labelRecoveries = env['COR_LABEL_RECOVERIES'] || 'Vyliecenych';
const labelDeaths = env['COR_LABEL_DEATHS'] || 'Smrti';

function drawChart(chartNode, timeAxis, dataConfirmed, dataRecovered, dataDeaths) {
  return chartNode.drawChart({
    type: 'line',
    data: {
      labels: timeAxis,
      datasets: [{
        label: labelCases,
        backgroundColor: '#6dad42',
        borderColor: '#6dad42',
        data: dataConfirmed,
        borderWidth: 4,
        fill: false,
      }, {
        label: labelRecoveries,
        data: dataRecovered,
        backgroundColor:'#ffffff',
        borderColor: '#ffffff',
        borderWidth: 4,
        fill: false,
      }, {
        label: labelDeaths,
        data: dataDeaths,
        backgroundColor:'#fb0000',
        borderColor: '#fb0000',
        borderWidth: 4,
        fill: false,
      }]
    },
    options: {},
  })
}

module.exports = {
  drawChart
};