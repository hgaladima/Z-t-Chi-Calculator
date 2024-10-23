document.addEventListener('DOMContentLoaded', function () {
    // Add event listeners
    document.getElementById('calculate-z-to-p').addEventListener('click', calculateZtoP);
    document.getElementById('calculate-p-to-z').addEventListener('click', calculatePtoZ);

    // Add input event listeners for real-time validation
    document.getElementById('z-to-p').addEventListener('input', validateZInput);
    document.getElementById('p-to-z').addEventListener('input', validatePInput);
});

function validateZInput(event) {
    const input = event.target;
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
        if (value < -6 || value > 6) {
            input.setCustomValidity('Z-scores typically range from -6 to 6');
        } else {
            input.setCustomValidity('');
        }
    }
}

function validatePInput(event) {
    const input = event.target;
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
        if (value < 0 || value > 1) {
            input.setCustomValidity('Probability must be between 0 and 1');
        } else {
            input.setCustomValidity('');
        }
    }
}

function calculatePtoZ() {
    try {
        const probability = parseFloat(document.getElementById('p-to-z').value);

        if (isNaN(probability)) {
            throw new Error('Please enter a valid probability');
        }
        if (probability <= 0 || probability >= 1) {
            throw new Error('Probability must be between 0 and 1');
        }

        // Calculate Z-score
        const zScore = jStat.normal.inv(probability, 0, 1);

        // Update result
        document.getElementById('p-to-z-result').textContent = zScore.toFixed(8);

        // Generate interpretation
        let interpretation = `For probability = ${probability.toFixed(4)}:<br>`;
        interpretation += `• This represents the ${(probability * 100).toFixed(2)}th percentile<br>`;
        interpretation += `• ${(probability * 100).toFixed(2)}% of the data falls below Z = ${zScore.toFixed(4)}<br>`;
        interpretation += `• ${((1 - probability) * 100).toFixed(2)}% of the data falls above Z = ${zScore.toFixed(4)}`;

        document.getElementById('p-to-z-interpretation').innerHTML = interpretation;

    } catch (error) {
        alert(error.message);
    }
}

function clearResults() {
    // Clear Z to P
    document.getElementById('z-to-p').value = '';
    document.getElementById('z-to-p-result').textContent = '-';
    document.getElementById('z-to-p-interpretation').innerHTML = '';

    // Clear P to Z
    document.getElementById('p-to-z').value = '';
    document.getElementById('p-to-z-result').textContent = '-';
    document.getElementById('p-to-z-interpretation').innerHTML = '';
}

// Add this to your z_calculator.js file

function createNormalCurveVisualization(zScore, type) {
    // Parameters for the normal curve
    const width = 400;
    const height = 200;
    const margin = 40;
    const curveWidth = width - 2 * margin;
    const curveHeight = height - 2 * margin;

    // Create points for normal curve
    function normalDensity(x) {
        return Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI);
    }

    // Generate curve points
    function generateCurvePoints() {
        const points = [];
        for (let x = -4; x <= 4; x += 0.1) {
            const xPos = margin + ((x + 4) * curveWidth) / 8;
            const yPos = height - margin - (normalDensity(x) * curveHeight);
            points.push(`${xPos},${yPos}`);
        }
        return points.join(' ');
    }

    // Generate path for shaded area
    function generateShadedArea(zScore, type) {
        let pathPoints = [];
        const baseY = height - margin;

        if (type === 'left') {
            // Points for left tail
            for (let x = -4; x <= zScore; x += 0.1) {
                const xPos = margin + ((x + 4) * curveWidth) / 8;
                const yPos = height - margin - (normalDensity(x) * curveHeight);
                pathPoints.push(`${xPos},${yPos}`);
            }
            // Complete the path
            const endX = margin + ((zScore + 4) * curveWidth) / 8;
            pathPoints.push(`${endX},${baseY}`);
            pathPoints.push(`${margin},${baseY}`);
        } else if (type === 'right') {
            // Points for right tail
            const startX = margin + ((zScore + 4) * curveWidth) / 8;
            pathPoints.push(`${startX},${baseY}`);
            for (let x = zScore; x <= 4; x += 0.1) {
                const xPos = margin + ((x + 4) * curveWidth) / 8;
                const yPos = height - margin - (normalDensity(x) * curveHeight);
                pathPoints.push(`${xPos},${yPos}`);
            }
            pathPoints.push(`${width - margin},${baseY}`);
        } else if (type === 'both') {
            // Points for both tails
            const absZ = Math.abs(zScore);
            // Left tail
            for (let x = -4; x <= -absZ; x += 0.1) {
                const xPos = margin + ((x + 4) * curveWidth) / 8;
                const yPos = height - margin - (normalDensity(x) * curveHeight);
                pathPoints.push(`${xPos},${yPos}`);
            }
            pathPoints.push(`${margin + ((-absZ + 4) * curveWidth) / 8},${baseY}`);
            pathPoints.push(`${margin},${baseY}`);
            // Close left path
            pathPoints.push('M');
            // Right tail
            const startX = margin + ((absZ + 4) * curveWidth) / 8;
            pathPoints.push(`${startX},${baseY}`);
            for (let x = absZ; x <= 4; x += 0.1) {
                const xPos = margin + ((x + 4) * curveWidth) / 8;
                const yPos = height - margin - (normalDensity(x) * curveHeight);
                pathPoints.push(`${xPos},${yPos}`);
            }
            pathPoints.push(`${width - margin},${baseY}`);
        }

        return pathPoints.join(' ');
    }

    // Add tick marks for x-axis
    function generateXAxisTicks() {
        let ticks = '';
        for (let x = -3; x <= 3; x++) {
            if (x !== 0) { // Skip 0 as it will be marked by y-axis
                const xPos = margin + ((x + 4) * curveWidth) / 8;
                ticks += `
                    <line x1="${xPos}" y1="${height - margin - 5}" x2="${xPos}" y2="${height - margin + 5}"
                          stroke="black" stroke-width="1"/>
                    <text x="${xPos}" y="${height - margin + 20}"
                          text-anchor="middle" font-size="12">${x}</text>
                `;
            }
        }
        return ticks;
    }

    // Create SVG with updated labels
    return `
        <svg width="${width}" height="${height}" class="normal-curve">
            <!-- Background grid (optional) -->
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="0.5"/>
                </pattern>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#grid)" />
            
            <!-- Axes -->
            <line x1="${margin}" y1="${height - margin}" x2="${width - margin}" y2="${height - margin}" 
                  stroke="black" stroke-width="1.5"/>
            <line x1="${margin}" y1="${margin}" x2="${margin}" y2="${height - margin}" 
                  stroke="black" stroke-width="1.5"/>
            
            <!-- X-axis ticks and labels -->
            ${generateXAxisTicks()}
            
            <!-- Origin label -->
            <text x="${margin}" y="${height - margin + 20}"
                  text-anchor="middle" font-size="12">0</text>
            
            <!-- Axis labels -->
            <text x="${width / 2}" y="${height - 5}"
                  text-anchor="middle" font-size="14" font-weight="bold">Standard Normal Distribution</text>
            
            <!-- Normal curve -->
            <polyline points="${generateCurvePoints()}"
                      fill="none" stroke="black" stroke-width="1.5"/>
            
            <!-- Shaded area -->
            <path d="M ${generateShadedArea(zScore, type)}"
                  fill="#2196F3" fill-opacity="0.3" stroke="none"/>
            
            <!-- Z-score marker -->
            <line x1="${margin + ((zScore + 4) * curveWidth) / 8}" 
                  y1="${height - margin - 5}"
                  x2="${margin + ((zScore + 4) * curveWidth) / 8}" 
                  y2="${height - margin + 5}"
                  stroke="#1976d2" stroke-width="2"/>
            <text x="${margin + ((zScore + 4) * curveWidth) / 8}" 
                  y="${height - margin + 20}"
                  text-anchor="middle" 
                  fill="#1976d2" 
                  font-weight="bold"
                  font-size="12">
                ${zScore.toFixed(2)}
            </text>
            
            <!-- Y-axis label -->
            <text x="${margin - 25}" y="${height / 2}"
                  text-anchor="middle"
                  transform="rotate(-90, ${margin - 25}, ${height / 2})"
                  font-size="12">Density</text>
        </svg>
    `;
}




function generateVisualizations(zScore, probability) {
    return `
        <div class="visualizations-container">
            <div class="probability-group">
                <div class="visualization-box">
                    <h4>Left-tail Probability: P(Z < ${zScore.toFixed(2)})</h4>
                    ${createNormalCurveVisualization(zScore, 'left')}
                    <p>Area = ${probability.toFixed(4)}</p>
                </div>
            </div>

            <div class="probability-group">
                <div class="visualization-box">
                    <h4>Right-tail Probability: P(Z > ${zScore.toFixed(2)})</h4>
                    ${createNormalCurveVisualization(zScore, 'right')}
                    <p>Area = ${(1 - probability).toFixed(4)}</p>
                </div>
            </div>

            <div class="probability-group">
                <div class="visualization-box">
                    <h4>Two-tailed Probability: P(|Z| > ${Math.abs(zScore).toFixed(2)})</h4>
                    ${createNormalCurveVisualization(zScore, 'both')}
                    <p>Area = ${(2 * (1 - jStat.normal.cdf(Math.abs(zScore), 0, 1))).toFixed(4)}</p>
                </div>
            </div>
        </div>
    `;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Modify your calculateZtoP function to use the new visualization generator--Enhanced Results and Interpretation
function calculateZtoP() {
    try {
        const zScore = parseFloat(document.getElementById('z-to-p').value);

        if (isNaN(zScore)) {
            throw new Error('Please enter a valid Z-score');
        }

        const probability = jStat.normal.cdf(zScore, 0, 1);
        const rightTail = 1 - probability;
        const twoTail = 2 * Math.min(probability, rightTail);

        // Update probability result with expanded information
        document.getElementById('z-to-p-result').textContent = probability.toFixed(8);

        // Generate comprehensive interpretation
        let interpretation = `
            <div class="interpretation-details">
                <div class="interpretation-section">
                    <h4>Statistical Summary for Z = ${zScore.toFixed(4)}</h4>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">Left-tail Probability:</span>
                            <span class="stat-value">P(Z ≤ ${zScore.toFixed(4)}) = ${probability.toFixed(8)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Right-tail Probability:</span>
                            <span class="stat-value">P(Z > ${zScore.toFixed(4)}) = ${rightTail.toFixed(8)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Two-tailed Probability:</span>
                            <span class="stat-value">P(|Z| > ${Math.abs(zScore).toFixed(4)}) = ${twoTail.toFixed(8)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Percentile:</span>
                            <span class="stat-value">${(probability * 100).toFixed(4)}th</span>
                        </div>
                    </div>
                </div>

                <div class="interpretation-section">
                    <h4>Practical Interpretation</h4>
                    <ul>
                        <li>${(probability * 100).toFixed(2)}% of the data falls below Z = ${zScore.toFixed(4)}</li>
                        <li>${(rightTail * 100).toFixed(2)}% of the data falls above Z = ${zScore.toFixed(4)}</li>
                        <li>This Z-score represents the ${(probability * 100).toFixed(2)}th percentile</li>
                        <li>${(twoTail * 100).toFixed(2)}% of the data falls beyond ${Math.abs(zScore).toFixed(4)} standard deviations from the mean in either direction</li>
                    </ul>
                </div>

                <div class="interpretation-section">
                    <h4>Common Applications</h4>
                    <div class="applications-grid">
                        <div class="application-item">
                            <h5>Confidence Intervals</h5>
                            <p>If using this Z-score for a confidence interval:</p>
                            <ul>
                                <li>Confidence Level: ${((1 - twoTail) * 100).toFixed(2)}%</li>
                                <li>Margin of Error: ±${Math.abs(zScore).toFixed(4)}σ</li>
                            </ul>
                        </div>
                        <div class="application-item">
                            <h5>Hypothesis Testing</h5>
                            <p>If using as a critical value:</p>
                            <ul>
                                <li>Significance Level (α): ${twoTail.toFixed(4)} (two-tailed)</li>
                                <li>Type I Error Rate: ${(twoTail * 100).toFixed(2)}%</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="interpretation-section">
                    <h4>Standard Normal Distribution Properties</h4>
                    <ul>
                        <li>Mean (μ) = 0</li>
                        <li>Standard Deviation (σ) = 1</li>
                        <li>This Z-score represents ${Math.abs(zScore).toFixed(4)} standard deviations from the mean</li>
                        <li>Direction: ${zScore > 0 ? 'Above' : 'Below'} the mean</li>
                    </ul>
                </div>
            </div>
        `;

        document.getElementById('z-to-p-interpretation').innerHTML = interpretation;

        // Generate visualizations
        document.getElementById('visualizations').innerHTML = generateVisualizations(zScore, probability);

    } catch (error) {
        alert(error.message);
        // Clear results on error...
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Add this CSS for interpretation details
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .interpretation-details {
        background-color: #fff;
        padding: 15px;
        border-radius: 4px;
        margin-top: 10px;
    }

    .interpretation-details p {
        margin: 0 0 10px 0;
        color: #1976d2;
        font-weight: 500;
    }

    .interpretation-details ul {
        margin: 0;
        padding-left: 20px;
    }

    .interpretation-details li {
        margin: 5px 0;
        color: #555;
    }
`;
document.head.appendChild(styleSheet);

///////////////////////////////////////////////

// Add this to your z_calculator.js file

function generateVisualizations(zScore, probability) {
    return `
        <div class="visualizations-container">
            <div class="probability-group">
                <div class="visualization-box">
                    <h4>Left-tail Probability: P(Z < ${zScore.toFixed(2)})</h4>
                    ${createNormalCurveVisualization(zScore, 'left')}
                    <p>Area = ${probability.toFixed(4)}</p>
                </div>
            </div>

            <div class="probability-group">
                <div class="visualization-box">
                    <h4>Right-tail Probability: P(Z > ${zScore.toFixed(2)})</h4>
                    ${createNormalCurveVisualization(zScore, 'right')}
                    <p>Area = ${(1 - probability).toFixed(4)}</p>
                </div>
            </div>

            <div class="probability-group">
                <div class="visualization-box">
                    <h4>Two-tailed Probability: P(|Z| > ${Math.abs(zScore).toFixed(2)})</h4>
                    ${createNormalCurveVisualization(zScore, 'both')}
                    <p>Area = ${(2 * (1 - jStat.normal.cdf(Math.abs(zScore), 0, 1))).toFixed(4)}</p>
                </div>
            </div>
        </div>
    `;
}

// Modify your calculateZtoP function to use the new visualization generator
function calculateZtoP() {
    try {
        const zScore = parseFloat(document.getElementById('z-to-p').value);

        if (isNaN(zScore)) {
            throw new Error('Please enter a valid Z-score');
        }

        const probability = jStat.normal.cdf(zScore, 0, 1);

        // Update result and interpretation as before
        document.getElementById('z-to-p-result').textContent = probability.toFixed(8);

        let interpretation = `For Z = ${zScore.toFixed(4)}:<br>`;
        interpretation += `• ${(probability * 100).toFixed(2)}% of the data falls below this Z-score<br>`;
        interpretation += `• ${((1 - probability) * 100).toFixed(2)}% of the data falls above this Z-score<br>`;
        interpretation += `• This corresponds to the ${(probability * 100).toFixed(2)}th percentile`;

        document.getElementById('z-to-p-interpretation').innerHTML = interpretation;

        // Generate visualizations with the new vertical layout
        document.getElementById('visualizations').innerHTML = generateVisualizations(zScore, probability);

    } catch (error) {
        alert(error.message);
    }
}
