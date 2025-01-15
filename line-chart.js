window.createLineChart = function() {
  function interpolatePoints(start, end, steps) {
    if (steps < 2) {
      throw new Error("Number of steps must be at least 2 (start and end points).");
    }
    const stepSize = (end - start) / (steps - 1); // Calculate the difference between points
    return Array.from({ length: steps }, (_, i) => start + i * stepSize);
  }

  const labels = ['0 Days', '7 Days', '14 Days', '21 Days' , '28 Days']
  const data = {
      labels: labels,
      datasets: [{
          label: 'DERS-16 (Emotional Regulation',
          data: interpolatePoints(55.5, 52.5, labels.length),
          fill: false,
          borderColor: '#c693c2',
          tension: 0.1
      },

      {
          label: 'TAS-DIF (Alexithymia)',
          data: interpolatePoints(23.4, 20.1, labels.length),
          fill: false,
          borderColor: '#89ccca',
          tension: 0.1
      },
      
      {
          label: 'GAD-7 (Anxiety)',
          data: interpolatePoints(12.1, 11.1, labels.length),
          fill: false,
          borderColor: '#fccb8d',
          tension: 0.1
      }]
  };

  new Chart(
    document.getElementById('line-chart'),
    {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        animation: true,
        plugins: {
          tooltip: {
            enabled: true
          },
          legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
                pointStyle: 'line',
                //borderWidth: 1,
                fillStyle: true,
                padding: 20,
                color: '#fff',
                font: {
                    size: 12,
                    color: '#fff'
                },
            },
        },
        },
        scales: {
          x: {
            border: {
                display: false
            },
            grid: {
                drawBorder: false, // controls grid border only
                drawOnChartArea: false,
                drawTicks: false,

            },
            ticks: {
                display: true,
                padding: 12,
                color: '#fff'
            },
            title: {
                display: true,
                text: 'Time Using Verenigma App',
                color: '#fff',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
          },
          y: {
              //min: 0,
              //max: 16,
              border: {
                display: false
            },
            grid: {
                drawBorder: false,
                drawTicks: true,
                color: 'rgba(255, 255, 255, 0.2)',
            },
            ticks: {
                display: true,
                padding: 20,
                color: '#fff'
            },
            title:  {
                display: true,
                text: 'Score',
                color: '#fff',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
          }
        },
      },
    }
  );
}