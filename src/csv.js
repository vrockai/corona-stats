const fs = require('fs');
const neatCsv = require('neat-csv');

function getCsvRowPromise(fileName, country) {
  return new Promise((resolve, reject) => {
    fs.readFile((fileName), async (err, data) => {
      if (err) {
        reject(err);
        console.error(err);
        return;
      }
      const csv = await neatCsv(data);

      const csvRow = csv.filter((line) => line['Country/Region'] === country)[0];

      const time = Object.keys(csvRow);
      time.splice(0, 47);

      const dat = Object.values(csvRow);
      dat.splice(0, 47);

      resolve([time, dat]);
    })
  })
}

module.exports = {
  getCsvRowPromise
};