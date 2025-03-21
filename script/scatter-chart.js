window.createScatterChart = function() {
    fetch('./json/sleepDiffStats.json')
        .then(response => response.json())
        .then(jsonData => {
            // Transform JSON data to Chart.js format
            const scatterPoints = jsonData.map(item => ({
                x: parseFloat(item.x),
                y: parseFloat(item.y)
            }));

            console.log(scatterPoints);

            // Compute linear regression
            function computeLinearRegression(data) {
                const N = data.length;
                const sumX = data.reduce((acc, point) => acc + point.x, 0);
                const sumY = data.reduce((acc, point) => acc + point.y, 0);
                const sumXY = data.reduce((acc, point) => acc + point.x * point.y, 0);
                const sumX2 = data.reduce((acc, point) => acc + point.x * point.x, 0);

                const numeratorM = (N * sumXY) - (sumX * sumY);
                const denominatorM = (N * sumX2) - (sumX * sumX);
                const m = numeratorM / denominatorM;

                const b = (sumY - (m * sumX)) / N;

                return { slope: m, intercept: b };
            }

            // Get regression line parameters
            const { slope, intercept } = computeLinearRegression(scatterPoints);

            // Generate points for the regression line
            function generateLinePoints(slope, intercept, data, numPoints = 2) {
                const xValues = data.map(pt => pt.x);
                const minX = Math.min(...xValues);
                const maxX = Math.max(...xValues);

                const step = (maxX - minX) / (numPoints - 1);
                const lineData = [];

                for (let i = 0; i < numPoints; i++) {
                    const x = minX + step * i;
                    const y = slope * x + intercept;
                    lineData.push({ x, y });
                }

                return lineData;
            }

            // Generate regression line data
            const lineOfBestFit = generateLinePoints(slope, intercept, scatterPoints);

            // Build Chart.js data object
            const data = {
                datasets: [
                    {
                        label: 'Scatter Points',
                        data: scatterPoints,
                        showLine: false,
                        borderColor: 'blue',
                        backgroundColor: 'blue'
                    },
                    {
                        label: 'Line of Best Fit',
                        data: lineOfBestFit,
                        showLine: true,
                        fill: false,
                        borderColor: 'red',
                        backgroundColor: 'red',
                        pointRadius: 0,
                    }
                ]
            };

            // Create the Chart
            new Chart(
                document.getElementById('scatter-chart'),
                {
                    type: 'scatter',
                    data: data,
                    options: {
                        responsive: true,
                        plugins: {
                            tooltip: {
                                enabled: true
                            },
                            legend: {
                                labels: {
                                    color: '#fff',
                                    font: {
                                        size: 12
                                    },
                                    usePointStyle: true,
                                    pointStyle: 'circle'
                                },
                            },
                        },
                        scales: {
                            x: {
                                type: 'linear',
                                position: 'bottom',
                                title: {
                                    display: true,
                                    text: 'X Axis Label',
                                    color: '#fff',
                                    font: {
                                        size: 14,
                                        weight: 'bold'
                                    }
                                },
                                ticks: {
                                    color: '#fff'
                                },
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.2)',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Y Axis Label',
                                    color: '#fff',
                                    font: {
                                        size: 14,
                                        weight: 'bold'
                                    }
                                },
                                ticks: {
                                    color: '#fff'
                                },
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.2)',
                                }
                            }
                        }
                    }
                }
            );
        }
    );
}
