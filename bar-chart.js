
window.createBarChart = function(){
  const data = {
    labels: ['ASRS (ADHD)', 'DERS-16 (Emotional Regulation)', 'TAS-DIF (Alexithymia)', 'ESS (Sleepiness)'], // Categories
    datasets: [
        {
            label: 'Before Trial ',
            data: [15, 25, 35, 45], // Data for "before"
            backgroundColor: '#DCDCDC',
            borderColor: '#fff', // Change to darker value than above
            borderWidth: 1,
            borderRadius: 8
        },
        {
            label: 'After 30 Day Trial',
            data: [10, 20, 30, 40], // Data for "after"
            backgroundColor: '#B0B0B0', 
            borderColor: '#fff', // Change to darker value than above
            borderWidth: 1, 
            borderRadius: 8
        }
    ]
  };

  new Chart(
    document.getElementById('bar-chart'),
    {
    type: 'bar',
    data: data,
    options: {
        responsive: true,
        animation: true,
        plugins: {
            legend: {
                position: 'chartArea',
                labels: {
                    usePointStyle: true, // Use circular points instead of squares
                    padding: 20, // Add padding around legend items
                    color: '#fff',
                    font: {
                        size: 12, // Change font size for the legend
                        color: '#fff'
                    },
                },
            },
            tooltip: {
                enabled: true
            }
        },
        scales: {
            x: {
                stacked: false, // Ensures bars are grouped and not stacked
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
                    text: 'Questionnaire (Condition)',
                    color: '#fff',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            y: {
                beginAtZero: true,
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
        }
    }
    });
}