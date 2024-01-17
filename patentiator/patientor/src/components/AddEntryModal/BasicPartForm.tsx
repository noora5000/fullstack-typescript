
import {  
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Autocomplete,
  Grid,
  Button
} from '@mui/material';
import { Type, Diagnosis } from '../../types';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs';

export const BaseForm = ({
    type, setType,
    date, setDate,
    specialist, setSpecialist,
    description, setDescription
  }: {
    type: Type, setType:React.Dispatch<React.SetStateAction<Type>>
    date: string, setDate:React.Dispatch<React.SetStateAction<string>>
    specialist: string, setSpecialist:React.Dispatch<React.SetStateAction<string>>
    description: string, setDescription:React.Dispatch<React.SetStateAction<string>>
  }) => { return(
    <div>
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">Select entry type</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={type}
          onChange={({ target }) => setType(target.value as Type)}
        >
          <FormControlLabel value="Hospital" control={<Radio />} label="Hospital" />
          <FormControlLabel value="HealthCheck" control={<Radio />} label="Health check" />
          <FormControlLabel value="OccupationalHealthcare" control={<Radio />} label="Occupational Healthcare" />
        </RadioGroup>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <DatePicker 
          label="Entry date" 
          value={date === '' ? null : date} 
          onChange={(newDate) => setDate(dayjs(newDate).format('YYYY-MM-DD'))}
          sx={{ width: '100%' }}
        />
      </LocalizationProvider> 
      <TextField
        label="Specialist"
        fullWidth
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
      />
      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={({ target }) => setDescription(target.value)}
      />
    </div>
  );
};

export const DiagnosisCodesField = ({allDiagnosisCodes, setDiagnosisCodes}
    :{
      allDiagnosisCodes:Diagnosis[]
      setDiagnosisCodes:React.Dispatch<React.SetStateAction<string[]>>
    }) => {
  return(
    <Autocomplete
    multiple
    id="combo-box-demo"
    options={allDiagnosisCodes}
    getOptionLabel={(diagnosis) => diagnosis.code + ' ' + diagnosis.name}
    fullWidth
    onChange={(_event, values) => {setDiagnosisCodes(values.map((v) => v.code));}}
    renderInput={(params) => <TextField {...params} label="Diagnosis codes" />}
    isOptionEqualToValue={(option, value) => option.code === value.code}
  />
  );
};
interface Props {
  onCancel: () => void;
}

export const FormControlPanel = ({onCancel}:Props) => {
  return(
    <Grid style={{'paddingTop': '20px'}}>
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          style={{ float: "left" }}
          type="button"
          onClick={(onCancel)}
        >
          Cancel
        </Button>
      </Grid>
      <Grid item>
        <Button
          style={{
            float: "right",
          }}
          type="submit"
          variant="contained"
        >
          Add
        </Button>
      </Grid>
    </Grid>
  );
};