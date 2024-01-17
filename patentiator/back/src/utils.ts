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

// Typeguards:
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (number: unknown): number is number => {
  return typeof number === 'number' || number instanceof Number;
};

const isDate = (date:string): boolean => {
    return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(g => g.toString()).includes(param);
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const isSickLeave = (object: unknown): object is { sickLeave: {startDate: unknown, endDate: unknown}} => {
  return(
    typeof object === 'object' &&
    object !== null &&
    'sickLeave' in object &&
    typeof object['sickLeave'] === 'object' &&
    object['sickLeave'] !== null &&
    'startDate' in object['sickLeave'] &&
    'endDate' in object['sickLeave']
  );
};

const isDischarge = (object: unknown): object is Discharge => {
  if (!object || typeof object !== 'object') {
    return false;
  }

  const { date, criteria } = object as { date: unknown; criteria: unknown };

  return isString(date) && isDate(date) && isString(criteria) && date !== '' && criteria !== '';
};

// Parsing:
const validateString = (value: unknown, fieldName: string): string => {
  if(!isString(value) || value == '') {
    throw new Error(`Incorrect or missing ${fieldName}`);
  }
  return value;
};
const parseName = (name: unknown): string => validateString(name, 'name');
const parseSsn = (ssn: unknown): string => validateString(ssn, 'ssn');
const parseOccupation = (occupation: unknown): string => validateString(occupation, 'occupation');
const parseDescription = (description: unknown): string => validateString(description, 'description');
const parseSpecialist = (specialist: unknown): string => validateString(specialist, 'specialist');
const parseEmployer = (employer: unknown): string => validateString(employer, 'employer');


const parseDate = (date: unknown): string => {
  if(!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date + ".");
  }
  return date;
};
  
const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
      throw new Error('Incorrect or missing gender: ' + gender + '.');
  }
  return gender;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const parseDischarge = (object: unknown): Discharge => {
  if (!isDischarge(object)) {
    throw new Error('Incorrect or missing discharge info.');
  }

  const { date, criteria } = object;
  return { date, criteria };
};

const parseSickLeave = (object: unknown): SickLeave | null => {
  if (!isSickLeave(object)) {
    return null;
  }

  const { sickLeave } = object;

  const { startDate, endDate } = sickLeave;

  if (!isString(startDate) || !isDate(startDate) || !isString(endDate) || !isDate(endDate)) {
    throw new Error('Incorrect or missing sick leave data.');
  }

  return { startDate, endDate };
};

const parseHealthCheckRating = (object: unknown):HealthCheckRating => {
  if (!isNumber(object) || !isHealthCheckRating(object)) {
    throw new Error('Incorrect or missing health check rating: ' + object + '.');
  }

  return object;
};
 