const channelID = 3297319;
const readAPIKey = "DBG9AO40GUBQOLFN";

const ctx = document.getElementById('aqiChart').getContext('2d');

// AQI Tick Labels
const aqiLabels = {
  0: 'Excellent',
  50: 'Good',
  100: 'Moderate',
  150: 'Poor',
  200: 'Very Poor',
  300: 'Hazardous',
  500: 'Extreme'
};

const aqiChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      data: [],
      borderColor: 'blue',
      borderWidth: 3,
      pointRadius: 0,
      tension: 0
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    layout: {
      padding: 10
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (Asia/Manila)'
        },
        grid: {
          color: '#ddd'
        }
      },
      y: {
        min: 0,
        max: 500,
        title: {
          display: true,
          text: 'AQI'
        },
        ticks: {
          stepSize: 50,
          callback: function(value) {
            return aqiLabels[value] || value;
          }
        },
        grid: {
          color: '#ddd'
        }
      }
    }
  }
});

// Convert to Philippine time
function toPHTime(dateStr) {
  const date = new Date(dateStr);
    return date.toLocaleString("en-PH", {
        timeZone: "Asia/Manila",
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
});
}

// Fetch ThingSpeak data
async function fetchData() {
  try {
    const url = `https://api.thingspeak.com/channels/${channelID}/fields/1.json?api_key=${readAPIKey}&results=100`;

    const response = await fetch(url);
    const data = await response.json();

    const labels = data.feeds.map(entry => toPHTime(entry.created_at));
    const values = data.feeds.map(entry => parseFloat(entry.field1));

    aqiChart.data.labels = labels;
    aqiChart.data.datasets[0].data = values;

    aqiChart.update();

  } catch (err) {
    console.error("Fetch error:", err);
  }
}

// Initial load
fetchData();

// Auto update every 15 seconds
setInterval(fetchData, 15000);