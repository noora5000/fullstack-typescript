import React from 'react';
import {  TextField,
FormControl,
FormControlLabel,
FormLabel,
Radio,
RadioGroup} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs';
import { Discharge, HealthCheckRating, SickLeave } from "../../types";

export const HospitalField = ({discharge, setDischarge}: {discharge: Discharge, setDischarge:React.Dispatch<React.SetStateAction<Discharge>>}) => {
  return(
    <div>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
    <DatePicker 
      label="Discharge date" 
      value={discharge.date === '' ? null : discharge.date} 
      onChange={(date) => setDischarge({...discharge, date: dayjs(date).format('YYYY-MM-DD')} as Discharge)} 
      sx={{ width: '100%' }}
    />
    </LocalizationProvider> 
    <TextField
      label="Discharge criteria"
      fullWidth
      value={discharge.criteria}
      onChange={({ target }) => setDischarge({...discharge, criteria: target.value})}
    />
  </div> 
  );
};

export const HealthCheckField = ({
  healthCheckRating, 
  setHealthCheckRating}: {
    healthCheckRating: HealthCheckRating, 
    setHealthCheckRating:React.Dispatch<React.SetStateAction<HealthCheckRating>>
  }) => {
  return(
    <div>
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Select health check rating</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={healthCheckRating}
        onChange={(event) => setHealthCheckRating(Number(event.target.value))}
      >
        <FormControlLabel value={HealthCheckRating.Healthy} control={<Radio />} label="Healthy" />
        <FormControlLabel value={HealthCheckRating.LowRisk} control={<Radio />} label="LowRisk" />
        <FormControlLabel value={HealthCheckRating.HighRisk} control={<Radio />} label="HighRisk" />
        <FormControlLabel value={HealthCheckRating.CriticalRisk} control={<Radio />} label="CriticalRisk" />
      </RadioGroup>
    </FormControl>
  </div> 
  );
};

export const OccupationalHealthcareField = ({
    employerName, 
    setEmployerName, 
    sickLeave, 
    setSickLeave}: {
    employerName: string, 
    setEmployerName:React.Dispatch<React.SetStateAction<string>>, 
    sickLeave: SickLeave, 
    setSickLeave:React.Dispatch<React.SetStateAction<SickLeave>>}) => {
  return(
    <div>
      <TextField
        label="Employer name"
        fullWidth
        value={employerName}
        onChange={({ target }) => setEmployerName(target.value)}
      />
      <p style={{'fontFamily': '"Roboto","Helvetica","Arial",sans-serif', 'marginBottom': '0px'}}>Sick Leave:</p>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <DatePicker label="Sick leave start date" value={sickLeave.startDate === '' ? null : sickLeave.startDate} onChange={(date) => setSickLeave({...sickLeave, startDate: dayjs(date).format('YYYY-MM-DD')})}/>
      </LocalizationProvider> 
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <DatePicker label="Sick leave end date" value={sickLeave.endDate === '' ? null : sickLeave.endDate} onChange={(date) => setSickLeave({...sickLeave, endDate: dayjs(date).format('YYYY-MM-DD')})}/>
      </LocalizationProvider> 
    </div> 
  );
};

