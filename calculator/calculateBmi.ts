// BMI calculator. Calculates the BMI based on the given parameters.
import  parseArguments  from './parseArguments';

const bmiCalculator = (height: number, weight: number) => {
  // Calculates BMI and returns a string feedback accordingly.
  const bmi = weight/((height/100)**2);
  switch(true){
    case bmi<18.5:
      return 'Underweight';
    case bmi>=18.5 && bmi<=25:
      return 'Normal (healthy weight)';
    case bmi>25:
      return 'Overweight';
    default:
      throw new Error('Invalid parameters.');
  }
};

  try {
    // Parse arguments inside imported function
    const valuesArray = parseArguments(process.argv, 'bmi').valuesArray;
    const height = valuesArray[0];
    const weight = valuesArray[1];
    // Calculate the average value, generate the return object and print it to the console.
    console.log(bmiCalculator(height, weight));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
//}

export default bmiCalculator;
