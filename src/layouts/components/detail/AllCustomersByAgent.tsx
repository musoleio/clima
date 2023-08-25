// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

import {getFirestore, collection, query, where} from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from '../../../firebase/config'
import {useRouter} from "next/router";
import PrivateRoute from "../../../pages/privateRoute";
import Button from "@mui/material/Button";
import exportDataToExcel from "../../../configs/exportToExcel";

interface RowType {
  name: string
  nrc: string
  institution: string
  phone: string
}

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

const rows: RowType[] = [

]

const statusObj: StatusObj = {
  applied: { color: 'info' },
  rejected: { color: 'error' },
  accepted: { color: 'success' }
}

const AllCustomersByAgent = (props) => {
  const router = useRouter()
  const [value, loading, error] = useCollection(
    query(
      collection(getFirestore(firebase), 'customers'),
      where('createdBy', '==', props.value.agentID)
    )
  );

  const handleExportClick = () => {
    if (value) {
      const data = value.docs.map((doc) => doc.data());
      exportDataToExcel(data, 'customers', 'output.xlsx');
    }
  };

  const newData: {
    name: string;
    nrc: string;
    id: string;
    institution: string;
    primaryPhoneNumber: string;
    orderCount: number;
    district: string;
    maritalStatus: string;
    title: string;
    dob: string;
    createdBy: string;
    timeStamp: { seconds: number; nanoseconds: number };
    department: string;
    secondaryPhoneNumber: string;
  }[] = [];

  value?.forEach((doc) => {
    const data = doc.data();
    console.log(`OUR CUSTOMERS ${JSON.stringify(data)}`);
    const {
      firstName,
      lastName,
      orderCount,
      district,
      maritalStatus,
      nrc,
      institution,
      primaryPhoneNumber,
      createdBy,
      title,
      timeStamp,
      department,
      secondaryPhoneNumber,
      dob,
      ...rest
    } = data;
    const name = `${firstName} ${lastName}`;
    newData.push({
      id: doc.id,
      name,
      nrc,
      institution,
      primaryPhoneNumber,
      orderCount,
      district,
      maritalStatus,
      title,
      dob,
      createdBy,
      timeStamp,
      department,
      secondaryPhoneNumber,
      ...rest,
    });

  });




  if (loading) {
    return 'loading...'
  }

  if (error) {
    return `Error fetching data: ${error}`
  }


  //console.log(`Our value is ${JSON.stringify(value)}`)

  return (
    <PrivateRoute>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <Button variant='contained' onClick={handleExportClick}>
          Export to Excel
        </Button>
      </Box>
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>NRC</TableCell>
                <TableCell>Institution</TableCell>
                <TableCell>Phone Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newData.map((row) => (
                <TableRow onClick={() => router.push(`/pages/customers/${row.id}`) } hover key={row.name} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.nrc}</TableCell>
                  <TableCell>{row.institution}</TableCell>
                  <TableCell>{row.primaryPhoneNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </PrivateRoute>
  )
}

export default AllCustomersByAgent
