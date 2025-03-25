window.createScatterChart = function() {
    Promise.all([
        fetch('./json/psqiDurat.json').then(response => response.json()),
        fetch('./json/psqiLaten.json').then(response => response.json())
    ])
    .then(([duratData, latenData]) => {
        const duratScatterPoints = duratData.map(item => ({
            x: parseFloat(item.x),
            y: parseFloat(item.y)
        }));

        const latenScatterPoints = latenData.map(item => ({
            x: parseFloat(item.x),
            y: parseFloat(item.y)
        }));

        // Compute regression parameters
        function computeRegression(data, type = 'linear') {
            if (type === 'linear') {
                const N = data.length;
                const sumX = data.reduce((acc, p) => acc + p.x, 0);
                const sumY = data.reduce((acc, p) => acc + p.y, 0);
                const sumXY = data.reduce((acc, p) => acc + p.x * p.y, 0);
                const sumX2 = data.reduce((acc, p) => acc + p.x * p.x, 0);

                const numerator = (N * sumXY) - (sumX * sumY);
                const denominator = (N * sumX2) - (sumX * sumX);
                const slope = numerator / denominator;
                const intercept = (sumY - slope * sumX) / N;

                return { slope, intercept };
            } else if (type === 'quadratic') {
                let sumX = 0, sumY = 0;
                let sumX2 = 0, sumX3 = 0, sumX4 = 0;
                let sumXY = 0, sumX2Y = 0;

                const n = data.length;
                for (let i = 0; i < n; i++) {
                    const x = data[i].x;
                    const y = data[i].y;
                    sumX += x;
                    sumY += y;
                    sumX2 += x * x;
                    sumX3 += x * x * x;
                    sumX4 += x * x * x * x;
                    sumXY += x * y;
                    sumX2Y += x * x * y;
                }

                const A = [
                    [n, sumX, sumX2],
                    [sumX, sumX2, sumX3],
                    [sumX2, sumX3, sumX4]
                ];
                const B = [sumY, sumXY, sumX2Y];

                const [a, b, c] = solve3x3(A, B);
                return { a, b, c };
            } else {
                throw new Error(`Unknown regression type: ${type}`);
            }
        }

        // Generate points for the regression line
        function generateRegressionPoints(params, data, numPoints = 50, type = 'linear') {
            const xValues = data.map(pt => pt.x);
            const minX = Math.min(...xValues);
            const maxX = Math.max(...xValues);
            const step = (maxX - minX) / (numPoints - 1);

            const lineData = [];

            for (let i = 0; i < numPoints; i++) {
                const x = minX + step * i;
                let y;

                if (type === 'linear') {
                    y = params.slope * x + params.intercept;
                } else if (type === 'quadratic') {
                    const { a, b, c } = params;
                    y = a + b * x + c * x * x;
                } else {
                    throw new Error(`Unknown regression type: ${type}`);
                }

                lineData.push({ x, y });
            }

            return lineData;
        }

        // Solve a 3x3 system using Cramer's rule
        function solve3x3(A, B) {
            const detA = determinant3x3(A);
            if (Math.abs(detA) < 1e-12) {
                throw new Error("Matrix is singular, cannot solve.");
            }
            const A0 = replaceColumn(A, B, 0);
            const A1 = replaceColumn(A, B, 1);
            const A2 = replaceColumn(A, B, 2);

            const x0 = determinant3x3(A0) / detA;
            const x1 = determinant3x3(A1) / detA;
            const x2 = determinant3x3(A2) / detA;

            return [x0, x1, x2];
        }

        function determinant3x3(m) {
            return (
                m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
                m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
                m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
            );
        }

        function replaceColumn(matrix, newCol, colIndex) {
            const copy = matrix.map(row => row.slice());
            for (let i = 0; i < 3; i++) {
                copy[i][colIndex] = newCol[i];
            }
            return copy;
        }

        // Choose regression type and compute parameters
        const regressionType = 'linear';  // or 'linear'
        const params1 = computeRegression(duratScatterPoints, regressionType);
        const params2 = computeRegression(latenScatterPoints, regressionType);

        // Generate line points for the regression line
        const duratBestFitPoints = generateRegressionPoints(params1, duratScatterPoints, 80, regressionType);
        const latenBestFitPoints = generateRegressionPoints(params2, latenScatterPoints, 80, regressionType);

        // Build Chart.js data object
        const data = {
            datasets: [
                {
                    label: 'Voice Notes vs Sleep Duration',
                    data: duratScatterPoints,
                    showLine: false,
                    borderColor: '#c693c2', // Match color from line-chart.js
                    backgroundColor: '#c693c2'
                },
                {
                    label: 'Sleep Duration Trend Line',
                    data: duratBestFitPoints,
                    showLine: true,
                    fill: false,
                    borderColor: '#89ccca', // Match color from line-chart.js
                    backgroundColor: '#89ccca',
                    pointRadius: 0,
                },
                {
                    label: 'Voice Notes vs Sleep Latency',
                    data: latenScatterPoints,
                    showLine: false,
                    borderColor: '#ffcc00', // New color for latency data
                    backgroundColor: '#ffcc00'
                },
                {
                    label: 'Sleep Latency Trend Line',
                    data: latenBestFitPoints,
                    showLine: true,
                    fill: false,
                    borderColor: '#ff6600', // New color for latency trend line
                    backgroundColor: '#ff6600',
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
                                text: 'Number of Voice Notes Recorded',
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
                                text: 'Sleep Duration & Latency Change (1 Month)',
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
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}
