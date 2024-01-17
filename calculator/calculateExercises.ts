// Exercise calculator. Calculates the average daily hours of exercise based on the given parameters
// and compares the result to the target value. Generates rating and rating description.
import parseArguments from './parseArguments';
// Interface for defining the return value.
interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number  
}
// Function to calculate the average exercise hours. Accepts a string of numbers, returns a 'result' object. 
export const exerciseCalculator = (exerciseValue: number[], target: number): Result => {
  const result = {
    periodLength: exerciseValue.length,
    trainingDays: exerciseValue.filter((value) => value !== 0).length,
    success: null,
    rating: null,
    ratingDescription: null,
    target: target,
    average: Number((exerciseValue.reduce((acc, num) => acc + num, 0))/exerciseValue.length)
  };
  // Generate the success, rating, and rating description values based on the calculated average and the target value.
  switch(true){
    case result.average < result.target:
      return {
        ...result,
        success: false,
        rating: 1,
        ratingDescription: "It seems you fell short of the minimum exercise goal (2 hours per day)."
      };
    case result.average === result.target:
      return {
        ...result,
        success: true,
        rating: 2,
        ratingDescription: "Congratulations! You've met the minimum exercise goal. Well done, but could you push it even further?."
      };
    case result.average > result.target:
      return {
        ...result,
        success: true,
        rating: 3,
        ratingDescription: "Fantastic job! You've exceeded the minimum exercise goal. Keep up the excellent work!"
      };
    default:
      throw new Error('Invalid parameters.');
  }
};

try {
  // Parse arguments inside imported function.
  const exerciseValues = parseArguments(process.argv, 'exercise');
  // Calculate BMI and print the result to the console.
  console.log(exerciseCalculator(exerciseValues.valuesArray, 2));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}