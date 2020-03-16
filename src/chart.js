const env = process.env;

const labelCases = env['COR_LABEL_CASES'] || 'Prípadov';
const labelRecoveries = env['COR_LABEL_RECOVERIES'] || 'Vyliečených';
const labelDeaths = env['COR_LABEL_DEATHS'] || 'Smrtí';

function drawChart(chartNode, timeAxis, dataConfirmed, dataRecovered, dataDeaths) {
  const gridLines = {
    color: '#323232',
    lineWidth: 2,
    borderDash: [5, 5],
  };

  const ticks = {
    fontColor: '#656565',
  };

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
        backgroundColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 4,
        fill: false,
      }, {
        label: labelDeaths,
        data: dataDeaths,
        backgroundColor: '#fb0000',
        borderColor: '#fb0000',
        borderWidth: 4,
        fill: false,
      }]
    },
    options: {
      scales: {
        xAxes: [{gridLines, ticks}],
        yAxes: [{gridLines, ticks}],
      },
      legend: {
        display: true,
        labels: {
          fontColor: '#ffffff',
          fontSize: 16
        },
      }
    },
  })
}

module.exports = {
  drawChart
};