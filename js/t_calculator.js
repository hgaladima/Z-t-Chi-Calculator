// Wait for DOM to fully load before attaching event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Attach event listeners to buttons
    document.getElementById('calculate-button').addEventListener('click', calculateT);
    document.getElementById('reset-button').addEventListener('click', resetForm);

    // Initial calculation with default values
    calculateT();
});

function calculateT() {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'flex';

    setTimeout(() => {
        try {
            // Get input values
            const alpha = parseFloat(document.getElementById('alpha').value);
            const df = parseInt(document.getElementById('df').value);
            const tStat = parseFloat(document.getElementById('t-stat').value);

            // Validate inputs
            if (isNaN(alpha) || alpha <= 0 || alpha >= 1) {
                throw new Error('Please enter a valid significance level between 0 and 1');
            }
            if (isNaN(df) || df < 1) {
                throw new Error('Please enter a valid degrees of freedom (must be positive)');
            }
            if (isNaN(tStat)) {
                throw new Error('Please enter a valid t statistic');
            }

            // Calculate P-values
            const leftTailP = jStat.studentt.cdf(tStat, df);
            const rightTailP = 1 - leftTailP;
            const twoTailP = 2 * Math.min(leftTailP, rightTailP);

            // Calculate Critical Values
            const leftCritical = jStat.studentt.inv(alpha, df);
            const rightCritical = jStat.studentt.inv(1 - alpha, df);
            const twoTailCritical = jStat.studentt.inv(1 - alpha / 2, df);

            // Update results
            document.getElementById('p-left').textContent = leftTailP.toFixed(8);
            document.getElementById('t-crit-left').textContent = leftCritical.toFixed(8);
            document.getElementById('p-right').textContent = rightTailP.toFixed(8);
            document.getElementById('t-crit-right').textContent = rightCritical.toFixed(8);
            document.getElementById('p-two').textContent = twoTailP.toFixed(8);
            document.getElementById('t-crit-two').textContent = `±${Math.abs(twoTailCritical).toFixed(8)}`;

            // Update summary statistics
            document.getElementById('summary-alpha').textContent = alpha.toFixed(4);
            document.getElementById('summary-df').textContent = df;
            document.getElementById('summary-t-stat').textContent = tStat.toFixed(4);

            // Determine conclusion
            let conclusion = 'Based on the analysis:<br>';
            if (twoTailP < alpha) {
                conclusion += '• Two-tailed test: Reject the null hypothesis<br>';
            } else {
                conclusion += '• Two-tailed test: Fail to reject the null hypothesis<br>';
            }
            if (leftTailP < alpha) {
                conclusion += '• Left-tailed test: Reject the null hypothesis<br>';
            } else {
                conclusion += '• Left-tailed test: Fail to reject the null hypothesis<br>';
            }
            if (rightTailP < alpha) {
                conclusion += '• Right-tailed test: Reject the null hypothesis';
            } else {
                conclusion += '• Right-tailed test: Fail to reject the null hypothesis';
            }

            document.getElementById('test-conclusion').innerHTML = conclusion;

        } catch (error) {
            alert(error.message);
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }, 100);
}

function resetForm() {
    if (confirm('Are you sure you want to reset all values?')) {
        // Reset inputs
        document.getElementById('alpha').value = '0.05';
        document.getElementById('df').value = '2';
        document.getElementById('t-stat').value = '1.92';

        // Reset results
        const resultFields = ['p-left', 't-crit-left', 'p-right', 't-crit-right', 'p-two', 't-crit-two'];
        resultFields.forEach(field => {
            document.getElementById(field).textContent = '-';
        });

        // Reset summary
        document.getElementById('summary-alpha').textContent = '-';
        document.getElementById('summary-df').textContent = '-';
        document.getElementById('summary-t-stat').textContent = '-';
        document.getElementById('test-conclusion').textContent = 'Enter values and click Calculate to see results.';
    }
}