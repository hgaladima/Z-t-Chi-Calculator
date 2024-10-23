# Z-t-Chi Calculator Documentation

## Technical Documentation

### Statistical Implementations

#### Z-Score Calculator
The Z-score calculator implements standard normal distribution calculations:
```javascript
// Example of Z to probability calculation
probability = jStat.normal.cdf(zScore, 0, 1);

// Example of probability to Z calculation
zScore = jStat.normal.inv(probability, 0, 1);
```

#### t-Test Calculator
The t-test calculator uses Student's t-distribution:
```javascript
// Critical value calculation
criticalValue = jStat.studentt.inv(1 - alpha/2, df);

// P-value calculation
pValue = jStat.studentt.cdf(tStat, df);
```

#### Chi-Square Calculator
The Chi-square calculator implements contingency table analysis:
```javascript
// Expected frequency calculation
expected[i][j] = (rowTotal[i] * colTotal[j]) / grandTotal;

// Chi-square statistic calculation
chiSquare += Math.pow(observed[i][j] - expected[i][j], 2) / expected[i][j];
```

### Visualization Implementation
- SVG-based normal distribution curve
- Dynamic area shading for probabilities
- Interactive elements for better understanding

## User Guide

### Z-Score Calculator
1. Enter a Z-score or probability value
2. View instant results with visualizations
3. Interpret comprehensive statistical summary

### t-Test Calculator
1. Input significance level (α)
2. Enter degrees of freedom
3. Input test statistic
4. View results and interpretations

### Chi-Square Calculator
1. Define table dimensions
2. Enter observed frequencies
3. Calculate and view results
4. Interpret statistical significance

## Maintenance and Updates

### Adding New Features
1. Fork the repository
2. Create a feature branch
3. Implement changes
4. Submit pull request

### Testing
- Test all calculators with known values
- Verify visualizations in different browsers
- Check responsive design on various devices

## API Documentation

### JavaScript Functions

```javascript
// Z-Score calculations
calculateZtoP(zScore)
calculatePtoZ(probability)

// t-Test calculations
calculateTTest(alpha, df, tStat)

// Chi-Square calculations
calculateChiSquare(observed, expected)
calculateExpectedFrequencies(data)
```

### CSS Classes
- `.calculator-container`: Main container for calculators
- `.visualization-box`: Container for visual elements
- `.results-container`: Results display area

## Troubleshooting

Common Issues and Solutions:
1. Incorrect probability calculations
   - Verify input values
   - Check for proper decimal formatting

2. Visualization not displaying
   - Ensure SVG support in browser
   - Check JavaScript console for errors

3. Results not updating
   - Verify event listeners
   - Check input validation
