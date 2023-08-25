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

import {getFirestore, collection, getDoc, doc} from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from '../../../firebase/config'
import {useRouter} from "next/router";
import PrivateRoute from "../../privateRoute";
import exportDataToExcel from "../../../configs/exportToExcel";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {Pagination} from "@mui/lab";
import {CircularProgress} from "@mui/material";

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}
const statusObj: StatusObj = {
  pending: { color: 'info' },
  rejected: { color: 'error' },
  accepted: { color: 'success' }
}

const OrdersPage = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const router = useRouter()
  const [searchTarget, setSearchTarget] = useState('nrc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [value, loading, error] = useCollection(
    collection(getFirestore(firebase), 'orders')
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
        const { myID, ...rest } = item; // Destructure `myID` from `item`
        return rest[searchTarget].toLowerCase().includes(searchQuery.toLowerCase());
      });

      const newData = filtered.map((item) => {
        console.log(`Item ID is ${item.myID}`);
        const { firstName, lastName, orderStatus, isCollected, ...rest } = item;
        const name = `${firstName} ${lastName}`;
        const status = orderStatus === 'accepted' ? 'accepted' : orderStatus === 'rejected' ? 'rejected' : 'pending';
        return {
          name,
          status,
          orderStatus,
          isCollected,
          itemNum: rest.itemNum,
          formType: rest.formType,
          installmentAmount: rest.installmentAmount,
          totalPrice: rest.totalPrice,
          collectionDate: rest.collectionDate,
          ...rest,
          id: item.myID, // Use `myID` instead of `id`
        };
      });

      const sortedData = newData
        .sort((a, b) => {
          const timestampA = a.timeStamp.seconds;
          const timestampB = b.timeStamp.seconds;
          return timestampB - timestampA;
        });

      setFilteredData(sortedData);
    }
  }, [value, searchQuery, searchTarget]);



  console.log(`Filtered data is: ${JSON.stringify(filteredData)}`)
  const handleChangeSearchTarget = (event) => {
    console.log(`search target value: ${event.target.value}`)
    setSearchTarget(event.target.value);
    console.log(`search target value after: ${searchTarget}`)
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredData.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const [exporting, setExporting] = useState(false);

  const handleExportClick = async () => {
    if (value) {
      setExporting(true);

      const data = [];

      // Iterate through each document in the value array
      for (const docSnapshot of value.docs) {
        const orderData = docSnapshot.data();

        // Fetch the user document from the "users" collection using createdBy
        const userDocRef = doc(getFirestore(firebase), 'users', orderData.createdBy);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();

        // Add the agent property to the orderData object
        orderData.agent = {
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
        };

        data.push(orderData);
      }

      exportDataToExcel(data, 'orders', 'output.xlsx', 'orders');

      setExporting(false);
    }
  };










  const newData: {
    id: string;
    name: string;
    status: string;
    orderStatus: any;
    isCollected: any;
    itemNum: any;
    formType: any;
    installmentAmount: any;
    totalPrice: any;
    collectionDate: any;
  }[] = [];

  value?.forEach((doc) => {
    const data = doc.data();
    const { firstName, lastName, orderStatus, isCollected, ...rest } = data;
    const name = `${firstName} ${lastName}`;
    const status = orderStatus === 'accepted' ? 'accepted' : 'rejected';
    newData.push({
      name,
      status,
      orderStatus,
      isCollected,
      itemNum: rest.itemNum,
      formType: rest.formType,
      installmentAmount: rest.installmentAmount,
      totalPrice: rest.totalPrice,
      collectionDate: rest.collectionDate,
      ...rest,
      id: doc.id
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
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="search-target-label">Search By</InputLabel>
          <Select
            labelId="search-target-label"
            id="search-target"
            value={searchTarget}
            label="Search By"
            onChange={handleChangeSearchTarget}
          >
            <MenuItem value="nrc">NRC</MenuItem>
            <MenuItem value="collectionDate">Collection Date</MenuItem>
            <MenuItem value="employeeNumber">Employee Number</MenuItem>
            <MenuItem value="firstName">First Name</MenuItem>
            <MenuItem value="lastName">Last Name</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            id="search-query"
            label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Box>
        <Button variant="contained" onClick={handleExportClick} disabled={exporting}>
          {exporting ? 'Exporting data...' : 'Export to Excel'}
          {exporting && <CircularProgress size={20} style={{ marginLeft: '10px' }} />}
        </Button>
      </Box>
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Is Collected</TableCell>
              <TableCell>Item Number</TableCell>
              <TableCell>Form Type</TableCell>
              <TableCell>Installment Amount</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Collection Date</TableCell>
              <TableCell>Order Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrders.map((row) => (
              <TableRow onClick={() => router.push(`/pages/orders/${row.id}`) } key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.isCollected ? 'Yes' : 'No'}</TableCell>
                <TableCell>{row.itemNum}</TableCell>
                <TableCell>{row.formType}</TableCell>
                <TableCell>{row.installmentAmount}</TableCell>
                <TableCell>{row.totalPrice}</TableCell>
                <TableCell>{row.collectionDate}</TableCell>
                <TableCell>
                  <Chip label={row.orderStatus} color={statusObj[row.status].color} />
                </TableCell>
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

export default OrdersPage
