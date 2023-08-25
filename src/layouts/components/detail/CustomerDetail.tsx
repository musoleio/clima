// ** React Imports
import {useState} from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

import Button from '@mui/material/Button'

import Typography from "@mui/material/Typography";

import CustomerDetailEdit from "./CustomerDetailEdit";
import CardContent from "@mui/material/CardContent";





const CustomerDetail = (props) => {



  const [isEditing, setIsEditing] = useState(false);
  const handleEdit = () => {
    setIsEditing(true);
  };
  if (isEditing) {
    return <CustomerDetailEdit {...props}  />;
  }

return (
  <CardContent>
    <div>
      <Grid container spacing={7}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Title:</Typography>
          <Typography>{props.value.title}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1"> Name:</Typography>
          <Typography>{`${props.value.firstName? props.value.firstName : null} ${props.value.lastName? props.value.lastName : null}`}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Order Count:</Typography>
          <Typography>{props.value.orderCount}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">NRC:</Typography>
          <Typography>{props.value.nrc}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Employee Number:</Typography>
          <Typography>{props.value.employeeNumber}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">District:</Typography>
          <Typography>{props.value.district}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Department:</Typography>
          <Typography>{props.value.department}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Institution:</Typography>
          <Typography>{props.value.institution}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Agent Name:</Typography>
          <Typography>{props.value.agentName}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Primary Phone Number:</Typography>
          <Typography>{props.value.primaryPhoneNumber}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Secondary Phone Number:</Typography>
          <Typography>{props.value.secondaryPhoneNumber}</Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleEdit}>
            Edit Customer
          </Button>
        </Grid>

      </Grid>
    </div>
  </CardContent>

)
}

export default CustomerDetail
