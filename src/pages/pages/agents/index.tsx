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


import { getFirestore, collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from '../../../firebase/config'

import Link from 'next/link'
import { useRouter } from 'next/router'
import PrivateRoute from "../../privateRoute";
import exportDataToExcel from "../../../configs/exportToExcel";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {Pagination} from "@mui/lab";

interface RowType {
  name: string
  district: string
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



const AgentsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const router = useRouter()
  const [searchTarget, setSearchTarget] = useState('firstName');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [value, loading, error] = useCollection(
    collection(getFirestore(firebase), 'users')
  );
  useEffect(() => {
    if (value) {
      const data = value.docs.map((doc) => {
        console.log(`But data has ${doc.id}`);
        return {
          myID: doc.id,
          ...doc.data(),
        };
      });

      const filtered = data.filter((item) => {
        const { myID, ...rest } = item;
        return rest[searchTarget].toLowerCase().includes(searchQuery.toLowerCase());
      });

      const newData = filtered.map((item) => {
        const {
          id,
          name,
          email,
          phoneNumber,
          orderCount,
          customerCount,
          deleteCount,
          dateJoined,
          lastName,
          firstName,
          district,
          ...rest
        } = item;

        return {
          id: item.myID,
          name,
          email,
          phoneNumber,
          orderCount,
          customerCount,
          deleteCount,
          dateJoined,
          lastName,
          firstName,
          district,
          ...rest,
        };
      });

      const sortedData = newData.sort((a, b) => {
        const dateA = a.dateJoined.toDate();
        const dateB = b.dateJoined.toDate();
        return dateB.getTime() - dateA.getTime();
      });

      setFilteredData(sortedData);
    }
  }, [value, searchQuery, searchTarget]);


  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredData.slice(indexOfFirstOrder, indexOfLastOrder);
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  const handleChangeSearchTarget = (event) => {
    setSearchTarget(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleExportClick = () => {
    if (value) {
      const data = value.docs.map((doc) => doc.data());
      exportDataToExcel(data, 'users', 'output.xlsx');
    }
  };
  const newData: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    orderCount: number;
    customerCount: number;
    deleteCount: number;
    dateJoined: { seconds: number; nanoseconds: number };
    lastName: string;
    firstName: string;
    district: string;
  }[] = [];

  value?.forEach((doc) => {
    const data = doc.data();
    console.log(`OUR USERS ${JSON.stringify(data)}`);
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      orderCount,
      customerCount,
      deleteCount,
      dateJoined,
      district,
      ...rest
    } = data;
    const name = `${firstName} ${lastName}`;
    newData.push({
      id: doc.id,
      name,
      email,
      phoneNumber,
      orderCount,
      customerCount,
      deleteCount,
      dateJoined,
      lastName,
      firstName,
      district
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <FormControl sx={{ minWidth: 200, marginRight: 2 }}>
          <InputLabel id="search-target-label">Search By</InputLabel>
          <Select
            labelId="search-target-label"
            id="search-target"
            value={searchTarget}
            label="Search By"
            onChange={handleChangeSearchTarget}
          >

            <MenuItem value="phoneNumber">Phone Number</MenuItem>
            <MenuItem value="firstName">First Name</MenuItem>
            <MenuItem value="lastName">Last Name</MenuItem>
            <MenuItem value="district">District</MenuItem>


          </Select>
        </FormControl>
        <TextField
          id="search-query"
          label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" onClick={handleExportClick}>
          Export to Excel
        </Button>
      </Box>
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Date Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {currentOrders.map((row) => (
              <TableRow onClick={() => router.push(`/pages/agents/${row.id}`)} hover key={row.name} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell
                  sx={{ py: theme => `${theme.spacing(0.5)} !important` }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.district}</TableCell>
                <TableCell>{row.phoneNumber}</TableCell>
                <TableCell>{`${new Date(row.dateJoined.seconds * 1000 + row.dateJoined.nanoseconds / 1000000).toLocaleDateString()}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
      {/* Pagination component */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Pagination
          count={Math.ceil(filteredData.length / ordersPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </PrivateRoute>
  )
}

export default AgentsPage
