
let bmiChart;
const historyKey = "bmiHistory";

function calculateBMI() {
  const heightCm = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const result = document.getElementById('result');
  const category = document.getElementById('category');
  const indicator = document.getElementById('bmi-indicator');
  const tips = document.getElementById('tips');

  if (isNaN(heightCm) || isNaN(weight) || heightCm <= 0 || weight <= 0) {
    result.textContent = "Please enter valid height and weight.";
    category.textContent = "";
    tips.textContent = "";
    return;
  }

  const heightM = heightCm / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(2);
  result.textContent = `Your BMI is ${bmi}`;

  let status = '', tip = '', leftPercent = 0;

  if (bmi < 18.5) {
    status = 'Underweight 😔';
    tip = "Try to eat more calories and protein-rich foods.";
    leftPercent = 10;
  } else if (bmi < 24.9) {
    status = 'Normal weight 😄';
    tip = "Great! Maintain with regular exercise and a balanced diet.";
    leftPercent = 30;
  } else if (bmi < 29.9) {
    status = 'Overweight 😬';
    tip = "Add more physical activity and reduce sugar intake.";
    leftPercent = 55;
  } else {
    status = 'Obese 😟';
    tip = "Consider a doctor consultation and start with walking daily.";
    leftPercent = 75;
  }

  category.textContent = `Status: ${status}`;
  tips.textContent = `Tip: ${tip}`;
  indicator.style.left = `${leftPercent}%`;

  const today = new Date().toLocaleDateString();
  saveToHistory(today, parseFloat(bmi));
}

function copyResult() {
  const resultText = document.getElementById("result").textContent + " " + document.getElementById("category").textContent;
  navigator.clipboard.writeText(resultText).then(() => {
    alert("Copied to clipboard!");
  });
}

function shareResult() {
  const text = document.getElementById("result").textContent + "\n" + document.getElementById("category").textContent;
  if (navigator.share) {
    navigator.share({ title: "My BMI Result", text });
  } else {
    alert("Sharing not supported on this device.");
  }
}

function loadHistory() {
  const saved = JSON.parse(localStorage.getItem(historyKey)) || [];
  return saved;
}

function saveToHistory(date, bmi) {
  const history = loadHistory();
  history.push({ date, bmi });
  localStorage.setItem(historyKey, JSON.stringify(history));
  updateChart();
}

function clearHistory() {
  localStorage.removeItem(historyKey);
  updateChart();
  alert("BMI history cleared!");
}

function exportCSV() {
  const history = loadHistory();
  if (history.length === 0) {
    alert("No data to export.");
    return;
  }

  let csv = "Date,BMI\n";
  history.forEach(entry => {
    csv += `${entry.date},${entry.bmi}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bmi_history.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function setupReminder() {
  if (Notification.permission === "granted") {
    scheduleReminder();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        scheduleReminder();
      }
    });
  }
}

function scheduleReminder() {
  setInterval(() => {
    new Notification("🧠 Daily BMI Check", {
      body: "Don't forget to calculate your BMI today!",
      icon: "icon-192.png"
    });
  }, 24 * 60 * 60 * 1000);
}

function updateChart() {
  const ctx = document.getElementById("bmiChart").getContext("2d");
  const history = loadHistory();
  const labels = history.map(item => item.date);
  const data = history.map(item => item.bmi);

  if (bmiChart) bmiChart.destroy();

  bmiChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "BMI Over Time",
        data,
        borderColor: "#00c3ff",
        backgroundColor: "#00c3ff40",
        tension: 0.3,
        fill: true,
        pointRadius: 5
      }]
    }
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("Service Worker Registered"));
}

updateChart();
