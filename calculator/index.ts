import express from 'express';
import bmiCalculator from './calculateBmi';
import { exerciseCalculator } from './calculateExercises';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (_req, res) => {
  const height = Number(_req.query.height);
  const weight = Number(_req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.status(400).send({
        error: "malformatted parameters"
      });
  }

  const bmiResult = bmiCalculator(height, weight);

  res.send({
    weight: weight,
    height: height,
    bmi: bmiResult
  });
});

app.post('/exercises', (req, res) => {

  interface ExerciseRequestBody {
    daily_exercises: unknown[];
    target: unknown;
  }

  const { daily_exercises, target }: ExerciseRequestBody = req.body as ExerciseRequestBody;
    // if required parameters are missing, return status 400.
  if ( !target || !daily_exercises ) {
    res.status(400).send({ error: 'parameters missing'});
  }
  // if the parameters are of the wrong type, return status 400.
  if (isNaN(Number(target)) || !Array.isArray(daily_exercises)) {
    res.status(400).send({ error: 'malformatted parameters'});
  }
  // if any member of the array is not a number, return status 400.
  daily_exercises.map((arg: string) => {
    const parsedNumber = parseFloat(arg);
    if (isNaN(Number(parsedNumber))) {
      res.status(400).send({ error: 'malformatted parameters'});
    }
  });
  const result = exerciseCalculator(daily_exercises as number[], Number(target));
  res.send({ result });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});