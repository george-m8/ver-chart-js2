/**
 * Compute regression parameters for either 'linear' or 'quadratic'.
 * data: array of { x: number, y: number }
 * type: 'linear' or 'quadratic'
 */
function computeRegression(data, type = 'linear') {
    if (type === 'linear') {
      // Compute linear regression (y = slope*x + intercept)
      const N = data.length;
      const sumX  = data.reduce((acc, p) => acc + p.x, 0);
      const sumY  = data.reduce((acc, p) => acc + p.y, 0);
      const sumXY = data.reduce((acc, p) => acc + p.x * p.y, 0);
      const sumX2 = data.reduce((acc, p) => acc + p.x * p.x, 0);
  
      const numerator = (N * sumXY) - (sumX * sumY);
      const denominator = (N * sumX2) - (sumX * sumX);
      const slope = numerator / denominator;
      const intercept = (sumY - slope * sumX) / N;
  
      return { slope, intercept };
    } 
    else if (type === 'quadratic') {
      // Fit y = a + b*x + c*x^2
      let sumX = 0, sumY = 0;
      let sumX2 = 0, sumX3 = 0, sumX4 = 0;
      let sumXY = 0, sumX2Y = 0;
  
      const n = data.length;
      for (let i = 0; i < n; i++) {
        const x = data[i].x;
        const y = data[i].y;
        sumX   += x;
        sumY   += y;
        sumX2  += x * x;
        sumX3  += x * x * x;
        sumX4  += x * x * x * x;
        sumXY  += x * y;
        sumX2Y += x * x * y;
      }
  
      // Solve for a, b, c in:
      //   [ n    Σx    Σx^2 ] [ a ]   [ Σy    ]
      //   [ Σx   Σx^2  Σx^3 ] [ b ] = [ Σxy   ]
      //   [ Σx^2 Σx^3  Σx^4 ] [ c ]   [ Σx^2y ]
      const A = [
        [ n,    sumX,   sumX2  ],
        [ sumX, sumX2,  sumX3  ],
        [ sumX2, sumX3, sumX4  ]
      ];
      const B = [ sumY, sumXY, sumX2Y ];
  
      const [a, b, c] = solve3x3(A, B);
      return { a, b, c };
    } 
    else {
      throw new Error(`Unknown regression type: ${type}`);
    }
  }
  
  /**
   * Generate a set of points from min(x)..max(x) based on the regression parameters.
   * - params: either { slope, intercept } or { a, b, c }
   * - type: 'linear' or 'quadratic'
   * - numPoints: how many points to generate for a smooth line
   */
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
        // y = m*x + b
        y = params.slope * x + params.intercept;
      } 
      else if (type === 'quadratic') {
        // y = a + b*x + c*x^2
        const { a, b, c } = params;
        y = a + b*x + c*x*x;
      } 
      else {
        throw new Error(`Unknown regression type: ${type}`);
      }
  
      lineData.push({ x, y });
    }
  
    return lineData;
  }
  
  /**
   * Solve a 3x3 system A * p = B (where A is 3x3, B is 3x1) using Cramer's rule.
   * Returns [p0, p1, p2].
   */
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

  