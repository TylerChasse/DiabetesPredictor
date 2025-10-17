## Setup and Installation Instructions

Need the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (usually comes with Node.js)

### Step-by-Step Installation

- Clone the repository
- Navigate to the project directory in a terminal (cd .../DiabetesPredictor).
- Run 'npm install' to download packages.
- Run 'npm run dev' to run site locally.
- Navigate to link provided in a browser. For example "http://localhost:5173".

### Data Flow
- Dashboard.jsx calls loadData() which lives in utils/DataAnalysis.js
- loadData() fetches and parses the dataset csv file and caches it along with the gathered metadata
- Calculation functions within DataAnalysis.js can used cachedData when making calculations
- Individual analytics/visualizations can import corresponding calculation functions from DataAnalysis.js
- Use UseMemo() when calling these functions ( for example: const ageBinnedData = useMemo(() => calculateAgeBinnedRisk(), []); )
- The data returned from these calculation functions can then be used for the analytics/visualizations as needed

### Updating Analytics/Visualizations

- Calculation functions that handle the data directly can be added to utils/DataAnalysis.js (for example, calculateAgeBinnedRisk())
- In your analytic/visualization file import this function and call it using UseMemo (see above)
- Use the returned data within your analytic/visualization
- Add you analytic/visualization into its respective AnalyticsSection/VisualizationsSection
- Any new css that's needed can be added to the respective AnalyticsSection/VisualizationsSection module.css file in the styles folder 

### Database Column Explanations

- HighBP : Indicates if the person has been told by a health professional that they have High Blood Pressure.
- HighChol : Indicates if the person has been told by a health professional that they have High Blood Cholesterol.
- CholCheck : Cholesterol Check, if the person has their cholesterol levels checked within the last 5 years.
- BMI : Body Mass Index, calculated by dividing the persons weight (in kilogram) by the square of their height (in meters).
- Smoker : Indicates if the person has smoked at least 100 cigarettes.
- Stroke : Indicates if the person has a history of stroke.
- Diabetes : Indicates if the person has a history of diabetes, or currently in pre-diabetes, or suffers from either type of diabetes.
- PhysActivity : Indicates if the person has some form of physical activity in their day-to-day routine.
- Fruits : Indicates if the person consumes 1 or more fruit(s) daily.
- Veggies : Indicates if the person consumes 1 or more vegetable(s) daily.
- HvyAlcoholConsump : Indicates if the person has more than 14 drinks per week.
- AnyHealthcare : Indicates if the person has any form of health insurance.
- NoDocbcCost : Indicates if the person wanted to visit a doctor within the past 1 year but couldn’t, due to cost.
- GenHlth : Indicates the persons response to how well is their general health, ranging from 1 (excellent) to 5 (poor).
- Menthlth : Indicates the number of days, within the past 30 days that the person had bad mental health.
- PhysHlth : Indicates the number of days, within the past 30 days that the person had bad physical health.
- DiffWalk : Indicates if the person has difficulty while walking or climbing stairs.
- Sex : Indicates the gender of the person, where 0 is female and 1 is male.
- Age : Indicates the age class of the person, where 1 is 18 years to 24 years up till 13 which is 80 years or older, each interval between has a 5-year increment.
- Education : Indicates the highest year of school completed, with 0 being never attended or kindergarten only and 6 being, having attended 4 years of college or more.
- Income : Indicates the total household income, ranging from 1 (at least $10,000) to 6 ($75,000+)
