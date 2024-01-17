import patientData from "../../data/patients";
import { Patient, NewPatientEntry, NonSensitivePatient, NewEntry, Entry } from "../types";
import { v1 as uuid } from 'uuid';

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};
const getPatientById = (findId: string): Patient => {
  const patientById = patientData.find((patient) => patient.id === findId);
  if(!patientById) {
    throw new Error(`Patient with id ${findId} not found.`);
  }
  return patientById;
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: uuid(),
  ...entry
  };
  patientData.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (entry: NewEntry, id: string): Entry => {
  const newEntry = {
    id: uuid(),
  ...entry
  };
  const patientToFind = getPatientById(id);
  patientToFind.entries.push(newEntry);
  
  const indexToFind = patientData.findIndex(x => x.id === patientToFind.id);
  patientData[indexToFind] = patientToFind;

  return newEntry;
};

export default {
  getNonSensitivePatients,
  getPatientById,
  addPatient,
  addEntry
};