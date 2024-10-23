# Z-t-Chi Calculator

A comprehensive statistical calculator for Z-scores, t-tests, and Chi-square analyses with interactive visualizations.

## Features

### Z-Score Calculator
- Calculate probabilities and areas under the normal curve
- Find Z-scores for given percentiles
- Interactive normal distribution visualizations
- Comprehensive statistical interpretations

### t-Test Calculator
- Calculate critical values and p-values
- Adjustable degrees of freedom
- Left-tailed, right-tailed, and two-tailed tests
- Detailed statistical summaries

### Chi-Square Calculator
- Test of independence calculations
- Expected frequency computations
- Contingency table analysis
- Clear result interpretations

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- jStat.js for statistical computations

## Project Structure
```
stattrio-pro/
│
├── src/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── z_calculator.js
│   │   ├── t_calculator.js
│   │   └── chi_square.js
│   └── pages/
│       ├── index.html
│       ├── z_calculator.html
│       ├── t_calculator.html
│       └── chi_square.html
│
├── assets/
│   └── images/
│
├── docs/
│   └── documentation.md
│
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stattrio-pro.git
```

2. Open any of the HTML files in a modern web browser, or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

## Usage

1. Select the appropriate calculator for your needs:
   - Z-Score Calculator for normal distribution analyses
   - t-Test Calculator for comparing means
   - Chi-Square Calculator for categorical data analysis

2. Enter your data according to the calculator's requirements

3. Click calculate to get instant results with visualizations

## Dependencies
- [jStat.js](https://github.com/jstat/jstat) - Statistical computations

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Acknowledgments
- Statistical formulas and methodologies based on standard statistical practices
- Visualizations inspired by educational statistical resources