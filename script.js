const addRowBtn = document.querySelector("#addRowBtn");
const table = document.querySelector("#dataTable");

addRowBtn.addEventListener("click", function () {
  const newRow = table.insertRow();
  const cell1 = newRow.insertCell(0);
  const cell2 = newRow.insertCell(1);

  const input1a = document.createElement("input");
  input1a.type = "number";
  input1a.setAttribute("placeholder", "Lower limit");
  const input1b = document.createElement("input");
  input1b.type = "number";
  input1b.setAttribute("placeholder", "Upper limit");
  const input2 = document.createElement("input");
  input2.type = "number";
  input2.setAttribute("placeholder", "Frequency");

  cell1.appendChild(input1a);
  cell1.appendChild(document.createTextNode(" - "));
  cell1.appendChild(input1b);
  cell2.appendChild(input2);
});

const removeRowBtn = document.querySelector("#removeRowBtn");

removeRowBtn.addEventListener("click", function () {
  const numRows = table.rows.length;

  if (numRows > 3) {
    const lastRow = table.rows[numRows - 1];

    if (lastRow) {
      table.deleteRow(lastRow.rowIndex);
    }
  }
});

function calc() {
  const rows = document.querySelectorAll("#dataTable tr:not(:first-child)");
  const classIntervals = [];
  const frequencies = [];

  rows.forEach((row) => {
    const lowerLimitInput = row.cells[0].querySelector(
      'input[type="number"]:nth-child(1)'
    );
    const upperLimitInput = row.cells[0].querySelector(
      'input[type="number"]:nth-child(2)'
    );
    const frequencyInput = row.cells[1].querySelector(
      'input[type="number"]'
    );

    const lowerLimit = parseFloat(lowerLimitInput.value);
    const upperLimit = parseFloat(upperLimitInput.value);
    const frequency = parseFloat(frequencyInput.value);

    if (!isNaN(lowerLimit) && !isNaN(upperLimit) && !isNaN(frequency)) {
      classIntervals.push([lowerLimit, upperLimit]);
      frequencies.push(frequency);
    }
  });

  const maxFrequency = Math.max(...frequencies);
  const modeIndex = frequencies.indexOf(maxFrequency);

  let mode = "No mode";

  if (modeIndex !== -1) {
    const l = classIntervals[modeIndex][0];
    const f1 = frequencies[modeIndex];
    const f0 = frequencies[modeIndex - 1] || 0;
    const f2 = frequencies[modeIndex + 1] || 0;
    const h = classIntervals[modeIndex][1] - classIntervals[modeIndex][0];

    mode = l + ((f1 - f0) / (2 * f1 - f0 - f2)) * h;
  }

  const cumulativeFrequencies = [frequencies[0]];
  for (let i = 1; i < frequencies.length; i++) {
    cumulativeFrequencies.push(cumulativeFrequencies[i - 1] + frequencies[i]);
  }

  const n = cumulativeFrequencies[cumulativeFrequencies.length - 1];

  let medianClassIndex = -1;

  for (let i = 0; i < cumulativeFrequencies.length; i++) {
    if (cumulativeFrequencies[i] >= n / 2) {
      medianClassIndex = i;
      break;
    }
  }

  if (medianClassIndex !== -1) {
    const lowerLimit = classIntervals[medianClassIndex][0];
    const upperLimit = classIntervals[medianClassIndex][1];
    const h = upperLimit - lowerLimit;
    const median = lowerLimit + ((n / 2 - cumulativeFrequencies[medianClassIndex - 1]) / frequencies[medianClassIndex]) * h;

    const mean = frequencies.reduce((sum, frequency, index) => {
      const classMidpoint = (classIntervals[index][0] + classIntervals[index][1]) / 2;
      return sum + classMidpoint * frequency;
    }, 0) / n;

    const meanElement = document.getElementById("mean");
    const modeElement = document.getElementById("mode");
    const medianElement = document.getElementById("median");

    meanElement.textContent = "Mean: " + mean.toFixed(2);
    modeElement.textContent = "Mode: " + mode.toFixed(2);
    medianElement.textContent = "Median: " + median.toFixed(2);
  }
}

const calcButton = document.querySelector("#calc");

calcButton.addEventListener("click", calc);
