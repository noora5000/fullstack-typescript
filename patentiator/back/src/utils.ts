import { NewPatientEntry, Gender, NewEntry, Discharge, SickLeave, HealthCheckRating, Diagnosis } from './types';

// Parse each field of the parameter object and make sure that the return value is exactly of type NewDiaryEntry
export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data.');
  }
  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    const newPatientEntry: NewPatientEntry = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: []
    };
    return newPatientEntry;
  }
  throw new Error('Incorrect data: some fields are missing.');
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data.');
  }

  if ('type' in object && 'description' in object && 'date' in object && 'specialist' in object) {
    switch (object.type) {
      case 'Hospital':
        if('discharge' in object){
          return {
            description: parseDescription(object.description),
            date: parseDate(object.date),
            specialist: parseSsn(object.specialist),
            diagnosisCodes: parseDiagnosisCodes(object),
            type: 'Hospital',
            discharge: parseDischarge(object.discharge),
          };
        } else {throw new Error('Incorrect data: some fields are missing.');}
      case 'OccupationalHealthcare':
        if('employerName' in object){
          const parsedSickLeave = parseSickLeave(object);
          console.log(parsedSickLeave);
          return {
            description: parseDescription(object.description),
            date: parseDate(object.date),
            specialist: parseSpecialist(object.specialist),
            diagnosisCodes: parseDiagnosisCodes(object),
            type: 'OccupationalHealthcare',
            employerName: parseEmployer(object.employerName),
            ...(parsedSickLeave && { sickLeave: parsedSickLeave })
          };
        } else {
          throw new Error('Incorrect data: some fields are missing.');
        }
      case 'HealthCheck':
        if('healthCheckRating' in object){
          return{
            description: parseDescription(object.description),
            date: parseDate(object.date),
            specialist: parseSsn(object.specialist),
            diagnosisCodes: parseDiagnosisCodes(object),
            type: 'HealthCheck',
            healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
          };
        } else {
          throw new Error('Incorrect data: some fields are missing.');
        }

      default:
        throw new Error('Unsupported entry type.');
    }
  }
  throw new Error('Incorrect data: some fields are missing.');
};

// typeguards:
// Returns a boolean and has a type predicate as the return type.
// If the type guard function returns true, the TypeScript compiler knows that the tested variable 
// has the type that was defined in the type predicate.
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (number: unknown): number is number => {
  return typeof number === 'number' || number instanceof Number;
};

const isDate = (date:string): boolean => {
    return Boolean(Date.parse(date));
};

// check that a param string is one of the accepted values (defined in enums (types.ts)).
// take the string representation of the enum values for the comparison by mapping.
const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(g => g.toString()).includes(param);
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

// Ensure that the comment field of the parsable object is of the type string.
const parseName = (name: unknown): string => {
  if(!isString(name) || name === '') {
    throw new Error('Incorrect or missing name.');
  }
  return name;
};

const parseDate = (date: unknown): string => {
  if(!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date + ".");
  }
  return date;
};

const parseSsn = (ssn: unknown): string => {
  if(!isString(ssn) || ssn === '') {
    throw new Error('Incorrect or missing ssn.');
  }
  return ssn;
};
  
const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
      throw new Error('Incorrect or missing gender: ' + gender + '.');
  }
  return gender;
};
const parseOccupation = (occupation: unknown): string => {
  if(!isString(occupation) || occupation === '') {
    throw new Error('Incorrect or missing occupation.');
  }
  return occupation;
};

const parseDescription = (name: unknown): string => {
  if(!isString(name) || name === '') {
    throw new Error('Incorrect or missing description.');
  }
  return name;
};
const parseSpecialist = (specialist: unknown): string => {
  if(!isString(specialist) || specialist === '') {
    throw new Error('Incorrect or missing specialist.');
  }
  return specialist;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const parseDischarge = (object: unknown): Discharge => {
  if (!object || typeof object !== 'object' || !('date' in object) || !('criteria' in object)) {
    throw new Error('Incorrect or missing discharge info.');
  }

  const { date, criteria } = object as { date: unknown; criteria: unknown };
  if (!isString(date) || !isDate(date) || !isString(criteria) || date==='' || criteria === '') {
    throw new Error('Incorrect or missing discharge info.');
  }
  return { date: date, criteria: criteria };
};

const parseEmployer = (employer: unknown):string => {
  if(!isString(employer) || employer === '') {
    throw new Error('Incorrect or missing employer name.');
  }
  return employer;
};

const parseSickLeave = (object: unknown): SickLeave | null => {
  if (!object || typeof object !== 'object' || !('sickLeave' in object)) {
    return null;
  }

  const { sickLeave } = object as { sickLeave: unknown };
  console.log(sickLeave);

  if (!sickLeave || typeof sickLeave !== 'object') {
    return null;
  }

  const { startDate, endDate } = sickLeave as { startDate: unknown; endDate: unknown };

  if (!startDate || !endDate || !isString(startDate) || !isDate(startDate) || !isString(endDate) || !isDate(endDate)) {
    throw new Error('Incorrect or missing sick leave data.');
  }

  return { startDate: startDate, endDate: endDate };
};


const parseHealthCheckRating = (object: unknown):HealthCheckRating => {
  if (!isNumber(object) || !isHealthCheckRating(object)) {
    throw new Error('Incorrect or missing health check rating: ' + object + '.');
  }

  return object;
};
 