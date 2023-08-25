// ** React Imports
import {forwardRef, useState} from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import { useDocument } from "react-firebase-hooks/firestore";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import firebase from '../../../firebase/config'

forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Date' fullWidth {...props} />
});
interface State {
  title: string
  firstName: string
  lastName: string
  nrc: string
  employeeNumber: string
  primaryPhoneNumber: string
  secondaryPhoneNumber: string
  district: string
  department: string
  institution: string
  createdBy: string
  createdOn: string
}

const CustomerDetail = (props) => {
  const [values, setValues] = useState<State>({
    title: '',
    firstName: '',
    lastName: '',
    nrc: '',
    employeeNumber: '',
    primaryPhoneNumber: '',
    secondaryPhoneNumber: '',
    district: '',
    department: '',
    institution: '',
    createdBy: '',
    createdOn: ''
  });

  const handleChange = (prop: keyof State) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  console.log(`We are dealing with customer: ${props.value.customerID}`)
  const [userValue, userLoading, userError] = useDocument(
    props.value && props.value.customerID ?
      doc(getFirestore(firebase), 'customers', String(props.value.customerID)) :
      null,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  console.log(`The agent createdBy is ${props.value.createdBy}`)

  const handleUpdate = async () => {
    if (userValue) {
      try {
        const updatedValues = {
          title: values.title || props.value.title,
          firstName: values.firstName || props.value.firstName,
          lastName: values.lastName || props.value.lastName,
          nrc: values.nrc || props.value.nrc,
          employeeNumber: values.employeeNumber || props.value.employeeNumber,
          primaryPhoneNumber: values.primaryPhoneNumber || props.value.primaryPhoneNumber,
          secondaryPhoneNumber: values.secondaryPhoneNumber || props.value.secondaryPhoneNumber,
          district: values.district || props.value.district,
          department: values.department || props.value.department,
          institution: values.institution || props.value.institution,
          createdBy:  props.value.createdBy,
          createdOn: values.createdOn || props.value.createdOn,
        };

        await updateDoc(userValue.ref, updatedValues);
        console.log('Document successfully updated!');
      } catch (err) {
        console.error('Error updating document:', err);
      }
    }
  };





  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>

          <Grid item xs={12} sm={6}>
            <InputLabel>Title</InputLabel>
            <FormControl fullWidth>
              <Select label={props.value.title} defaultValue={props.value.title}
                      placeholder={props.value.title} value={values.title} onChange={handleChange('title')}>
                <MenuItem value='Mr'>Mr</MenuItem>
                <MenuItem value='Ms'>Ms</MenuItem>
                <MenuItem value='Mrs'>Mrs</MenuItem>
                <MenuItem value='Miss'>Miss</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>First Name</InputLabel>
            <TextField
              fullWidth
              label={props.value.firstName}
              value={values.firstName}
              onChange={handleChange('firstName')}
              placeholder='First Name'
              defaultValue={props.value.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Last Name</InputLabel>
            <TextField
              fullWidth
              label={props.value.lastName}
              value={values.lastName}
              onChange={handleChange('lastName')}
              placeholder='Last Name'
              defaultValue='Some Name'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>NRC</InputLabel>
            <TextField
              fullWidth
              label={props.value.nrc}
              value={values.nrc}
              onChange={handleChange('nrc')}
              placeholder='NRC'
              defaultValue='Some NRC'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Employee Number</InputLabel>
            <TextField
              fullWidth
              label={props.value.employeeNumber}
              value={values.employeeNumber}
              onChange={handleChange('employeeNumber')}
              placeholder='Employee Number'
              defaultValue='Some Num'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>District</InputLabel>
            <TextField
              fullWidth
              label={props.value.district}
              value={values.district}
              onChange={handleChange('district')}
              placeholder='District'
              defaultValue='Some Num'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Department</InputLabel>
            <TextField
              fullWidth
              label={props.value.department}
              placeholder='Department'
              value={values.department}
              onChange={handleChange('department')}
              defaultValue='Some Num'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Institution</InputLabel>
            <TextField
              fullWidth
              label={props.value.institution}
              value={values.institution}
              onChange={handleChange('institution')}
              placeholder='Institution'
              defaultValue='Some Num'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Agent Name</InputLabel>
            <TextField
              fullWidth
              label={props.value.agentName}
              value={values.createdBy}
              onChange={handleChange('createdBy')}
              placeholder='Created By'
              defaultValue='Some Num'
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel>Primary PhoneNumber</InputLabel>
            <TextField fullWidth type='number' label={props.value.primaryPhoneNumber}
                       value={values.primaryPhoneNumber}
                       onChange={handleChange('primaryPhoneNumber')}
                       placeholder='(123) 456-7890' />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel>Secondary PhoneNumber</InputLabel>
            <TextField fullWidth type='number' label={props.value.secondaryPhoneNumber}
                       value={values.secondaryPhoneNumber}
                       onChange={handleChange('secondaryPhoneNumber')}
                       placeholder='(123) 456-7890' />
          </Grid>



          <Grid onClick={() => { handleUpdate() }}  item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default CustomerDetail
