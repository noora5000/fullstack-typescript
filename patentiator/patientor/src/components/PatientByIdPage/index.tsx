import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import { Diagnosis, Patient } from "../../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Entry } from "../../types";
import { Button } from "@mui/material";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../../types";
import axios from "axios";

interface Props {
  diagnoses : Diagnosis[]
}

const PatientByIdPage = ({ diagnoses } : Props) => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  useEffect(()=> {
    if(!id){
      throw new Error('Something went wrong- cant fetch id.');
    }
    const fetchPatientById = async () => {
      try {
        const patientData = await patientService.getById(id);
        setPatient(patientData);
      } catch(error) {
        throw new Error(`Error: can't fetch data by id ${id}.`);
      }
    };
    fetchPatientById();
  }, [id]);

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      if(patient){
        const newEntry = await patientService.createEntry(patient?.id, values);
        const updatedEntries = patient.entries.concat(newEntry);
        setPatient({ ...patient, entries: updatedEntries });
        setModalOpen(false);
      } else {
        setError("Unrecognized error");
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  const FindDiagnoses: React.FC<{ entry: Entry }> = ({ entry }) => (
    <>
        <div key={entry.id}>
          {entry.diagnosisCodes?.map((item, index) => {
            const foundDiagnosis = diagnoses.find((diag) => diag.code === item);
            return (
              <li key={index}>
                {foundDiagnosis?.code} {foundDiagnosis?.name}
              </li>
            );
          })}
        </div>
    </>
  );

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case "Hospital":
        return <div>
            <p>{entry.date} {entry.type}</p>
            <p style={{ 'fontStyle': 'italic' }}>{entry.description}</p>
            <p>Discharge: {entry.discharge.date}: {entry.discharge.criteria}</p>
          </div>;
      case "OccupationalHealthcare":
        return <div>
            <p>{entry.date} {entry.type}. Employer: {entry.employerName}</p>
            <p style={{ 'fontStyle': 'italic' }}>{entry.description}</p>
            {!entry.sickLeave ? null : <p>Sick leave: {entry.sickLeave?.startDate} — {entry.sickLeave?.endDate}</p>}
          </div>;
      case "HealthCheck":
        return <div>
          <p>{entry.date} {entry.type}</p>
          <p style={{ 'fontStyle': 'italic' }}>{entry.description}</p>
          {entry.healthCheckRating === 0 ?
            <FavoriteIcon style={{ 'color': 'green' }}/> : entry.healthCheckRating === 1 ?
            <FavoriteIcon style={{ 'color': 'yellow' }}/> : <FavoriteIcon style={{ 'color': 'red' }}/>
          }
        </div>;
      default:
        return assertNever(entry);
    }
  };
  
  const assertNever = (value:never):never => {
    throw new Error(`Error - Unexpected value; ${JSON.stringify(value)}`);
  };



  if(patient){
    return (
      <div className="App">
          <h2>{patient.name}
            <svg width="24" height="24" viewBox="0 0 24 24">
              {patient.gender === 'male' ? <MaleIcon /> : patient.gender === 'female' ? <FemaleIcon /> : null }
            </svg>
          </h2>
          <p>Ssn: {patient.ssn}</p>
          <p>Occupation: {patient.occupation}</p>
          <h3>Entries</h3>
          {patient.entries.map((entry, index) => (
            <div key={index} style={{ 'border': '1px solid black', 'borderRadius': '8px', 'marginBottom': '10px', 'paddingLeft': '10px'}}>
              <EntryDetails entry={entry}/>
              <FindDiagnoses entry={entry}/>
              <p>Diagnosed by {entry.specialist}.</p>
            </div>
          ))}
        <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
      </div>);
  } else {
    return (
      <div className="App">
          <p>Error: can't fetch data by id ${id}.</p>
        </div>);
  }
};

export default PatientByIdPage;