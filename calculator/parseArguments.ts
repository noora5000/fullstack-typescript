// Function to validate arguments. The required number of arguments depends on the 'type' parameter.
const parseArguments = (args: string[], type: string) => {
  if(type === 'bmi'){
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');
  } else if(type==='exercise'){
    if (args.length < 3) throw new Error('Not enough arguments.');
  }
  
  const parseableArray = args.slice(2);
  // Convert the given arguments to numbers by mapping.
  const valuesArray = parseableArray.map((arg) => {
    const parsedNumber = parseFloat(arg);
    if (isNaN(parsedNumber)) {
      throw new Error(`Invalid value: ${arg}`);
    }
    return parsedNumber;
  });
  return {
    valuesArray: valuesArray
  };
};

export default parseArguments;