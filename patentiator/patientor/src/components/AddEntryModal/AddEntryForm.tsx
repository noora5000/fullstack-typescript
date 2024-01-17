import { useState, SyntheticEvent, useEffect } from "react";

import { EntryFormValues, Type, Discharge, HealthCheckRating, Diagnosis, NewBaseEntry } from "../../types";
import diagnosisService from "../../services/diagnoses";
import { HospitalField, HealthCheckField, OccupationalHealthcareField } from "./TypePartForm";
import { BaseForm, DiagnosisCodesField, FormControlPanel } from "./BasicPartForm";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
}

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [date, setDate] = useState('');
  const [type, setType] = useState(Type.Hospital);
  const [specialist, setSpecialist] = useState('');
  const [description, setDescription] = useState('');
  const [discharge, setDischarge] = useState<Discharge>({ date: '', criteria: '' });
  const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);
  const [employerName, setEmployerName] = useState('');
  const [sickLeave, setSickLeave] = useState({startDate: '', endDate: ''});
  const [allDiagnosisCodes, setAllDiagnosisCodes] = useState<Diagnosis[]>([]);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  useEffect (() => {
    const fetchDiagnosisCodes = async () => {
      try{
        const diagnoses = await diagnosisService.getAll();
        setAllDiagnosisCodes(diagnoses);
      } catch (error){
        console.log('Error fetching diagnosis codes.');
      }
    };

    fetchDiagnosisCodes();
  }, []);
  
  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
  
    const baseEntryValues: NewBaseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes,
    };
  
    let entryValues: EntryFormValues;
  
    if (type === 'Hospital') {
      entryValues = { ...baseEntryValues, type, discharge };
    } else if (type === 'HealthCheck') {
      entryValues = { ...baseEntryValues, type, healthCheckRating };
    } else if (type === 'OccupationalHealthcare') {
      entryValues = { ...baseEntryValues, type, employerName };
      if (sickLeave.startDate !== '' || sickLeave.endDate !== '') {
        entryValues.sickLeave = sickLeave;
      }
    } else {
      throw new Error(`Invalid entry type: ${type}`);
    }
    onSubmit(entryValues);
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <BaseForm 
          type={type} setType={setType} 
          date={date} setDate={setDate} 
          specialist={specialist} setSpecialist={setSpecialist} 
          description={description} setDescription={setDescription}
        />
        {type === "Hospital" && <HospitalField discharge={discharge} setDischarge={setDischarge} />}
        {type === "HealthCheck" && <HealthCheckField healthCheckRating={healthCheckRating} setHealthCheckRating={setHealthCheckRating}/>}
        {type === "OccupationalHealthcare" && <OccupationalHealthcareField 
          employerName={employerName} setEmployerName={setEmployerName} 
          sickLeave={sickLeave} setSickLeave={setSickLeave}
        />}
        <DiagnosisCodesField allDiagnosisCodes={allDiagnosisCodes} setDiagnosisCodes={setDiagnosisCodes}/>
        <FormControlPanel onCancel={onCancel}/>
      </form>
    </div>
  );
};

export default AddEntryForm;