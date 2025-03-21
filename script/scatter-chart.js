window.createScatterChart = function() {
    fetch('./json/sleepDiffStats.json')
        .then(response => response.json())
        .then(jsonData => {
        // data is now your JSON array, e.g. [{ "X": "44", "Y": "-1" }, { "X": "153", "Y": "-2" }, ...]

        // Transform into Chart.js format: [{ x: number, y: number }, ...]
        const scatterPoints = jsonData.map(item => ({
            x: parseFloat(item.x),
            y: parseFloat(item.y)
        }));

        console.log(scatterPoints);

        // 2) Write a helper function to compute the linear regression
        //    slope (m) and intercept (b).
        function computeLinearRegression(data) {
            /*
            Slope (m) = [N * Σ(xy) - Σ(x)Σ(y)] / [N * Σ(x^2) - (Σ(x))^2]
            Intercept (b) = (Σ(y) - m * Σ(x)) / N
            where N is the number of points
            */
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

        // 3) Compute the regression line from your scatter data.
        const { slope, intercept } = computeLinearRegression(scatterPoints);

        // 4) Create a helper function to generate (x,y) for the line of best fit.
        //    We'll span from the minimum x to the maximum x in your dataset.
        function generateLinePoints(slope, intercept, data, numPoints = 2) {
            // The simplest approach is to just get two points at the min and max of x.
            // If you want a smoother line or more points, increase numPoints accordingly.
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

        // 5) Generate the array of (x, y) points for the regression line.
        const lineOfBestFit = generateLinePoints(slope, intercept, scatterPoints);

        // 6) Build the Chart.js data object for a scatter plot plus the regression line.
        const data = {
            datasets: [
            {
                label: 'Scatter Points',
                data: scatterPoints,
                showLine: false, // For pure scatter
                borderColor: 'blue', // Customize to your styling
                backgroundColor: 'blue'
            },
            {
                label: 'Line of Best Fit',
                data: lineOfBestFit,
                showLine: true,
                fill: false,
                borderColor: 'red', // Customize to your styling
                backgroundColor: 'red',
                pointRadius: 0,     // Hide the points if you only want the line
            }
            ]
        };

        // 7) Create the Chart
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
